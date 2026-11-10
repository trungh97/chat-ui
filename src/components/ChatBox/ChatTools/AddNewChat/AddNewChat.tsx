import { ContactListModal } from '@components/ContactList'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddIcon, Button } from 'shared-ui'

/** The "+" in the chat list header; opens the contact list to start a direct message. */
export const AddNewChat = React.memo(() => {
  const { t } = useTranslation()
  const [isContactsOpen, setIsContactsOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        intent="ghost"
        size="sm"
        aria-label={t('contacts.open')}
        title={t('contacts.open')}
        icon={{ content: <AddIcon transform="scale(0.75)" />, iconOnly: true }}
        onClick={() => setIsContactsOpen(true)}
      />
      <ContactListModal
        open={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
      />
    </>
  )
})

export default AddNewChat
