import { DEFAULT_LIMIT } from '@constants/pagination'
import { useGetMyLatestConversationsQuery } from '@generated/graphql'
import { formatConversationList } from '../data'
import { CursorBasedPagination } from '../types'

export const useMyLatestConversations = (options: CursorBasedPagination) => {
  const { data, error, loading } = useGetMyLatestConversationsQuery({
    variables: {
      options: {
        cursor: options.cursor,
        limit: options.limit || DEFAULT_LIMIT,
      },
    },
  })

  return {
    conversations: formatConversationList(data),
    loading,
    error,
  }
}
