import React from 'react'
import { useTranslation } from 'react-i18next'
import { Input, SearchIcon } from 'shared-ui'

export const SearchChat = React.memo(() => {
  const { t } = useTranslation()

  return (
    <div className="my-6 px-[1.5rem]">
      <Input
        variant="leading-icon"
        placeholder={t('chat.list.searchPlaceholder')}
        className="bg-brand-100"
        icon={<SearchIcon color="#717680" transform="scale(0.8)" />}
      />
    </div>
  )
})

export default SearchChat
