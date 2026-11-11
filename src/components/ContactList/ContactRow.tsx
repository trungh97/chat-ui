import type { ContactUser } from '@hooks/user/useSearchUsers'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Badge, Button, NameAvatar } from 'shared-ui'

export type ContactRowProps = {
  user: ContactUser
  isOnline: boolean
  onMessage: (user: ContactUser) => void
  /** True while this row's conversation is opening. */
  isOpening?: boolean
}

export const ContactRow = memo(
  ({ user, isOnline, onMessage, isOpening = false }: ContactRowProps) => {
    const { t } = useTranslation()
    const name = `${user.firstName} ${user.lastName}`.trim()

    return (
      <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50">
        {user.avatar ? (
          <Avatar imageUrl={user.avatar} size="md" />
        ) : (
          <NameAvatar
            size="md"
            firstName={user.firstName}
            lastName={user.lastName}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-gray-900">{name}</span>
            <Badge
              size="sm"
              color={isOnline ? 'success' : 'gray'}
              content={t(isOnline ? 'contacts.online' : 'contacts.offline')}
            />
          </div>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
        </div>
        <Button
          size="sm"
          intent="secondary"
          label={t('contacts.message')}
          aria-label={t('contacts.messageUser', { name })}
          disabled={isOpening}
          onClick={() => onMessage(user)}
        />
      </div>
    )
  },
)

export default ContactRow
