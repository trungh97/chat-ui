import { ContactListModal } from '@components/ContactList'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon } from 'shared-ui'

/** The "+" in the chat list header; opens the contact list to start a direct message. */
export const AddNewChat = React.memo(() => {
  const { t } = useTranslation()
  const [isContactsOpen, setIsContactsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={t('contacts.open')}
        title={t('contacts.open')}
        className="flex items-center p-2 transition-all duration-300 ease-in-out hover:cursor-pointer hover:rounded-md hover:bg-brand-100 hover:text-brand-600"
        onClick={() => setIsContactsOpen(true)}
      >
        <AddIcon transform="scale(0.75)" />
      </button>
      <ContactListModal
        open={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </>
  )
})

export default AddNewChat
