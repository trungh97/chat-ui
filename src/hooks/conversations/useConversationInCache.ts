import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
  useFragment,
} from '@apollo/client'
import {
  ExtendConversationDto,
  ExtendedConversationFragmentDoc,
} from '@generated/graphql'

export const useConversationInCache = ({
  conversationId,
  fragment = ExtendedConversationFragmentDoc,
  fragmentName = 'extendedConversation',
}: {
  conversationId: string
  fragment?:
    | DocumentNode
    | TypedDocumentNode<ExtendConversationDto, OperationVariables>
  fragmentName?: string
}) => {
  const data = useFragment<ExtendConversationDto>({
    from: {
      __typename: 'ExtendConversationDTO',
      id: conversationId,
    },
    fragment,
    fragmentName,
  })

  return data
}
