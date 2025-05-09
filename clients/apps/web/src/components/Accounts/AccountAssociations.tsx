import { schemas } from '@polar-sh/client'
import React, { useMemo } from 'react'

interface AccountAssociationsProps {
  account: schemas['Account']
  prefix?: string
}

const AccountAssociations: React.FC<AccountAssociationsProps> = ({
  account,
  prefix,
}) => {
  const associations = useMemo(
    () =>
      account.users.reduce<string[]>(
        (array, user) =>
          array.some((value) => value === user.email)
            ? array
            : [...array, user.email],
        account.organizations.map(({ name }) => name),
      ),
    [account],
  )

  return (
    <p>
      {associations.length === 0 && <>Unused</>}
      {associations.length > 0 && (
        <>
          {prefix ? `${prefix} ` : ''}
          {associations.map((association, index) => (
            <React.Fragment key={association}>
              <span className="font-medium">{association}</span>
              {`${index < associations.length - 2 ? ', ' : ''}${
                index === associations.length - 2 && associations.length > 1
                  ? ' and '
                  : ''
              }
              `}
            </React.Fragment>
          ))}
        </>
      )}
    </p>
  )
}

export default AccountAssociations
