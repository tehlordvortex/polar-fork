import { promises as fs } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import satori from 'satori'

import Badge from 'polarkit/components/Badge'

type BadgeAmount = {
  currency: string
  amount: number
}

type BadgeData = {
  badge_type: string
  width: number
  height: number
  amount: BadgeAmount | null
}

const readPublicFileBuffer = async (filename: string) => {
  const publicDirectory = path.join(process.cwd(), '/public')
  const fileContents = await fs.readFile(publicDirectory + filename)
  return fileContents
}

const getFontBuffer = async (name: string) => {
  const fontPath = `/fonts/${name}`
  return await readPublicFileBuffer(fontPath)
}

const getBadgeData = async (
  org: string,
  repo: string,
  number: string,
): Promise<BadgeData> => {
  const base = process.env.NEXT_PUBLIC_API_URL
  // TODO: Store this in an environment variable for easier customization?
  const endpoint = `${base}/api/v1/integrations/github/${org}/${repo}/issues/${number}/badges/funding`
  const response = await fetch(endpoint)
  const data = await response.json()

  if (!data.badge_type) throw new Error('Invalid badge response')
  return data as BadgeData
}

const generateBadge = async (
  org: string,
  repo: string,
  number: string,
  debug: string,
) => {
  const badge = await getBadgeData(org, repo, number)
  let hasAmount = badge.amount !== null
  // hasAmount = true // debugging purposes

  const interRegular = await getFontBuffer('Inter-Regular.ttf')
  const svg = await satori(<Badge showAmountRaised={hasAmount} />, {
    width: badge.width,
    height: badge.height,
    fonts: [
      {
        name: 'Inter',
        data: interRegular,
        weight: 400,
        style: 'normal',
      },
    ],
    debug: parseInt(debug) === 1,
  })

  return svg
}

export default async function handler(req: NextRequest, res: NextResponse) {
  console.log(req.query)
  const { org, repo, number, debug } = req.query

  try {
    const svg = await generateBadge(org, repo, number, debug)
    res.setHeader('Content-Type', 'image/svg+xml')
    res.end(svg)
  } catch (error) {
    // TODO: Return 1x1 pixel transparent SVG to avoid browser issues
  }
}
