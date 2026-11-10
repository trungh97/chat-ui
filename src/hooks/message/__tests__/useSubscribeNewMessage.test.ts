import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import {
  ConversationType,
  NewMessageAddedSubscription,
  useNewMessageAddedSubscription,
  useUpdateLastReceivedMessageMutation,
} from '@generated/graphql'
import { useDraftConversationStore } from '@store/draftConversation'
import { usePendingMessageStore } from '@store/pendingMessage'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useSubscribeNewMessage } from '../useSubscribeNewMessage'

let mockParams: { conversationId?: string; userId?: string } = {}
const mockNavigate = jest.fn()
const mockAddConversationToList = jest.fn()

jest.mock('react-router-dom', () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
}))

jest.mock('@hooks/auth', () => ({
  useAuth: () => ({ data: { me: { data: { id: 'me' } } } }),
}))

jest.mock('@hooks/conversations/useAddConversationToList', () => ({
  ...jest.requireActual('@hooks/conversations/useAddConversationToList'),
  useAddConversationToList: () => mockAddConversationToList,
}))

jest.mock('@generated/graphql', () => ({
  ...jest.requireActual('@generated/graphql'),
  useNewMessageAddedSubscription: jest.fn(),
  useUpdateLastReceivedMessageMutation: jest.fn(),
}))

const LIST_QUERY = gql`
  query List {
    getMyConversations {
      data {
        items {
          id
        }
      }
    }
  }
`

const newMessage = (
  conversationId: string,
  senderId = 'u2',
): NewMessageAddedSubscription =>
  ({
    newMessageAdded: {
      __typename: 'MessageWithConversationDTO',
      id: 'm1',
      content: 'hi',
      messageType: 'TEXT',
      senderId,
      extra: null,
      conversationId,
      replyToMessageId: null,
      createdAt: '2026-11-08T10:00:00.000Z',
      clientMessageId: 'cm1',
      senderName: 'Ann Lee',
      senderAvatar: null,
      conversation: {
        __typename: 'ConversationDTO',
        id: conversationId,
        title: null,
        creatorId: senderId,
        isArchived: false,
        deletedAt: null,
        type: ConversationType.Private,
        groupAvatar: null,
        lastMessageAt: '2026-11-08T10:00:00.000Z',
      },
    },
  }) as unknown as NewMessageAddedSubscription

const listIds = (client: ApolloClient<unknown>) =>
  client
    .readQuery<{
      getMyConversations: { data: { items: { id: string }[] } }
    }>({ query: LIST_QUERY })
    ?.getMyConversations.data.items.map(({ id }) => id)

describe('useSubscribeNewMessage', () => {
  let client: ApolloClient<unknown>
  let onData: (args: unknown) => void
  const updateLastReceived = jest.fn()

  const deliver = (data: NewMessageAddedSubscription) =>
    act(() => {
      onData({ data: { data, loading: false, error: undefined }, client })
    })

  beforeEach(() => {
    mockParams = {}
    mockNavigate.mockReset()
    mockAddConversationToList.mockReset().mockResolvedValue(null)
    updateLastReceived.mockReset().mockResolvedValue({})
    useDraftConversationStore.setState({ drafts: {} })
    usePendingMessageStore.setState({ pendingMessages: {} })

    client = new ApolloClient({ cache: new InMemoryCache() })
    client.writeQuery({
      query: LIST_QUERY,
      data: {
        getMyConversations: {
          __typename: 'ExtendConversationListGlobalResponse',
          data: {
            __typename: 'PaginatedConversationListResponse',
            items: [
              { __typename: 'ExtendConversationDTO', id: 'c1' },
              { __typename: 'ExtendConversationDTO', id: 'c2' },
            ],
          },
        },
      },
    })

    jest
      .mocked(useNewMessageAddedSubscription)
      .mockImplementation((options) => {
        onData = options?.onData as (args: unknown) => void
        return { error: undefined } as ReturnType<
          typeof useNewMessageAddedSubscription
        >
      })
    jest
      .mocked(useUpdateLastReceivedMessageMutation)
      .mockReturnValue([updateLastReceived] as unknown as ReturnType<
        typeof useUpdateLastReceivedMessageMutation
      >)
  })

  it('moves a known conversation to the top without fetching it', () => {
    renderHook(() => useSubscribeNewMessage())

    deliver(newMessage('c2'))

    expect(listIds(client)).toEqual(['c2', 'c1'])
    expect(mockAddConversationToList).not.toHaveBeenCalled()
    expect(updateLastReceived).toHaveBeenCalledWith({
      variables: { conversationId: 'c2', messageId: 'm1' },
    })
  })

  it('fetches an unknown conversation to insert it in the chat list', async () => {
    renderHook(() => useSubscribeNewMessage())

    deliver(newMessage('c-new'))

    await waitFor(() =>
      expect(mockAddConversationToList).toHaveBeenCalledWith('c-new'),
    )
    // The list is left to the fetch, which inserts the conversation as this user sees it.
    expect(listIds(client)).toEqual(['c1', 'c2'])
  })

  it('replaces an open draft with the new 1:1 conversation', async () => {
    mockParams = { userId: 'u2' }
    useDraftConversationStore.getState().addDraft({
      userId: 'u2',
      name: 'Ann Lee',
      avatar: null,
      createdAt: '2026-11-08T09:00:00.000Z',
    })
    mockAddConversationToList.mockResolvedValue({
      id: 'c-new',
      type: ConversationType.Private,
      participants: [{ userId: 'me' }, { userId: 'u2' }],
    })
    renderHook(() => useSubscribeNewMessage())

    deliver(newMessage('c-new'))

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/c-new', { replace: true }),
    )
    expect(useDraftConversationStore.getState().drafts).toEqual({})
  })

  it('removes a matching draft that is not open, without navigating', async () => {
    mockParams = { conversationId: 'c1' }
    useDraftConversationStore.getState().addDraft({
      userId: 'u2',
      name: 'Ann Lee',
      avatar: null,
      createdAt: '2026-11-08T09:00:00.000Z',
    })
    mockAddConversationToList.mockResolvedValue({
      id: 'c-new',
      type: ConversationType.Private,
      participants: [{ userId: 'me' }, { userId: 'u2' }],
    })
    renderHook(() => useSubscribeNewMessage())

    deliver(newMessage('c-new'))

    await waitFor(() =>
      expect(useDraftConversationStore.getState().drafts).toEqual({}),
    )
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('moves messages still pending in the replaced draft to the conversation', async () => {
    mockParams = { userId: 'u2' }
    useDraftConversationStore.getState().addDraft({
      userId: 'u2',
      name: 'Ann Lee',
      avatar: null,
      createdAt: '2026-11-08T09:00:00.000Z',
    })
    usePendingMessageStore.setState({
      pendingMessages: {
        failed: {
          clientMessageId: 'failed',
          conversationId: 'draft:u2',
          content: 'hi',
          createdAt: '2026-11-08T09:30:00.000Z',
          status: 'ERROR',
        },
      },
    })
    mockAddConversationToList.mockResolvedValue({
      id: 'c-new',
      type: ConversationType.Private,
      participants: [{ userId: 'me' }, { userId: 'u2' }],
    })
    renderHook(() => useSubscribeNewMessage())

    deliver(newMessage('c-new'))

    await waitFor(() =>
      expect(usePendingMessageStore.getState().pendingMessages.failed).toEqual(
        expect.objectContaining({ conversationId: 'c-new', status: 'ERROR' }),
      ),
    )
  })

  it('does not mark its own message as received', () => {
    renderHook(() => useSubscribeNewMessage())

    deliver(newMessage('c1', 'me'))

    expect(updateLastReceived).not.toHaveBeenCalled()
  })
})
