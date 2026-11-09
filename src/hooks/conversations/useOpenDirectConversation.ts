import { useGetDirectConversationLazyQuery } from '@generated/graphql'
import { useDraftConversationStore } from '@store/draftConversation'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export type DirectConversationUser = {
  id: string
  firstName: string
  lastName: string
  avatar?: string | null
}

/**
 * Opens the 1:1 conversation with `user`: the existing one if there is one, otherwise a
 * draft that becomes a real conversation when the first message is sent.
 * Rejects when the lookup fails.
 */
export const useOpenDirectConversation = () => {
  const navigate = useNavigate()
  const addDraft = useDraftConversationStore.use.addDraft()
  const [getDirectConversation] = useGetDirectConversationLazyQuery({
    fetchPolicy: 'network-only',
  })

  return useCallback(
    async (user: DirectConversationUser) => {
      const { data, error } = await getDirectConversation({
        variables: { userId: user.id },
      })
      const response = data?.getDirectConversation

      if (error || !response || response.error) {
        throw new Error(
          response?.error ??
            error?.message ??
            'Failed to open the conversation',
        )
      }

      if (response.data) {
        navigate(`/${response.data.id}`)
        return
      }

      addDraft({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        avatar: user.avatar ?? null,
        createdAt: new Date().toISOString(),
      })
      navigate(`/new/${user.id}`)
    },
    [addDraft, getDirectConversation, navigate],
  )
}

export default useOpenDirectConversation
