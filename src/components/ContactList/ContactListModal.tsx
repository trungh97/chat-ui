import { useInfiniteScroll } from '@hooks/common'
import { useOpenDirectConversation } from '@hooks/conversations/useOpenDirectConversation'
import { useContactPresence } from '@hooks/user/useContactPresence'
import { ContactUser, useSearchUsers } from '@hooks/user/useSearchUsers'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, message, Modal, Skeleton } from 'shared-ui'
import { ContactRow } from './ContactRow'

export type ContactListModalProps = {
  open: boolean
  onClose: () => void
}

/** Lists the other users; "Message" opens the 1:1 with that user, or a draft of it. */
export const ContactListModal = memo(
  ({ open, onClose }: ContactListModalProps) => {
    const { t } = useTranslation()
    const [search, setSearch] = useState('')
    const [openingUserId, setOpeningUserId] = useState<string | null>(null)
    const searchRef = useRef<HTMLInputElement | null>(null)

    const { users, loading, isFetchingMore, hasNextPage, loadMore, error } =
      useSearchUsers({ search, skip: !open })
    const onlineByUserId = useContactPresence({ skip: !open })
    const openDirectConversation = useOpenDirectConversation()

    const { sentinelRef } = useInfiniteScroll({
      onLoadMore: loadMore,
      hasNextPage,
      loading: loading || isFetchingMore,
    })

    // Start from an empty search every time it opens.
    useEffect(() => {
      if (!open) setSearch('')
    }, [open])

    const handleMessage = async (user: ContactUser) => {
      setOpeningUserId(user.id)
      try {
        await openDirectConversation(user)
        onClose()
      } catch {
        message.error(t('contacts.openError'))
      } finally {
        setOpeningUserId(null)
      }
    }

    const renderList = () => {
      if (loading && users.length === 0) {
        return (
          <div className="flex flex-col gap-3 px-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} avatar title={false} loading />
            ))}
          </div>
        )
      }

      if (error) {
        return (
          <p className="px-3 text-sm text-error-600">
            {t('contacts.loadError')}
          </p>
        )
      }

      if (users.length === 0) {
        return (
          <p className="px-3 text-sm text-gray-500">{t('contacts.empty')}</p>
        )
      }

      return (
        <>
          {users.map((user) => (
            <ContactRow
              key={user.id}
              user={user}
              isOnline={onlineByUserId[user.id] ?? user.isOnline}
              onMessage={handleMessage}
              isOpening={openingUserId === user.id}
            />
          ))}
          <div ref={sentinelRef} className="h-1" />
          {isFetchingMore && (
            <p className="px-3 text-sm text-gray-500">{t('common.loading')}</p>
          )}
        </>
      )
    }

    return (
      <Modal
        open={open}
        onClose={onClose}
        title={t('contacts.title')}
        initialFocus={searchRef}
        className="h-[32rem]"
      >
        <div className="flex h-full flex-col gap-3">
          <Input
            ref={searchRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('contacts.searchPlaceholder')}
            aria-label={t('contacts.searchPlaceholder')}
          />
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
            {renderList()}
          </div>
        </div>
      </Modal>
    )
  },
)

export default ContactListModal
