import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  Reference,
} from '@apollo/client'
import { act, renderHook } from '@testing-library/react'
import React from 'react'
import {
  moveConversationToTop,
  useAddConversationToList,
} from '../useAddConversationToList'

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

const conversation = (id: string) => ({
  __typename: 'ExtendConversationDTO',
  id,
  title: 'Ann Lee',
  type: 'PRIVATE',
  participants: [],
})

const writeList = (client: ApolloClient<unknown>, ids: string[]) =>
  client.writeQuery({
    query: LIST_QUERY,
    data: {
      getMyConversations: {
        __typename: 'ExtendConversationListGlobalResponse',
        data: {
          __typename: 'PaginatedConversationListResponse',
          items: ids.map((id) => ({ __typename: 'ExtendConversationDTO', id })),
        },
      },
    },
  })

const listIds = (client: ApolloClient<unknown>) =>
  client
    .readQuery<{
      getMyConversations: { data: { items: { id: string }[] } }
    }>({ query: LIST_QUERY })
    ?.getMyConversations.data.items.map(({ id }) => id)

describe('useAddConversationToList', () => {
  let client: ApolloClient<unknown>
  let query: jest.SpyInstance

  const setup = () =>
    renderHook(() => useAddConversationToList(), {
      wrapper: ({ children }) => (
        <ApolloProvider client={client}>{children}</ApolloProvider>
      ),
    }).result

  const respondWith = (data: ReturnType<typeof conversation> | null) => {
    // Normalise the result into the cache, as a real query would.
    query.mockImplementation(async () => {
      if (data) {
        client.cache.writeFragment({
          data,
          fragment: gql`
            fragment Saved on ExtendConversationDTO {
              id
              title
              type
            }
          `,
        })
      }
      return { data: { getConversationById: { data } } }
    })
  }

  beforeEach(() => {
    client = new ApolloClient({ cache: new InMemoryCache() })
    query = jest.spyOn(client, 'query')
  })

  it('fetches the conversation and puts it at the top of the chat list', async () => {
    writeList(client, ['c1', 'c2'])
    respondWith(conversation('c-new'))
    const result = setup()

    let returned: unknown
    await act(async () => {
      returned = await result.current('c-new')
    })

    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { conversationId: 'c-new' },
        fetchPolicy: 'network-only',
      }),
    )
    expect(returned).toEqual(conversation('c-new'))
    expect(listIds(client)).toEqual(['c-new', 'c1', 'c2'])
  })

  it('moves a conversation the list already has instead of adding it twice', async () => {
    writeList(client, ['c1', 'c2'])
    respondWith(conversation('c2'))
    const result = setup()

    await act(() => result.current('c2'))

    expect(listIds(client)).toEqual(['c2', 'c1'])
  })

  it('leaves the cache alone when the chat list has not loaded', async () => {
    respondWith(conversation('c-new'))
    const result = setup()

    await act(() => result.current('c-new'))

    expect(listIds(client)).toBeUndefined()
  })

  it('returns null and leaves the list when the conversation is not available', async () => {
    writeList(client, ['c1'])
    respondWith(null)
    const result = setup()

    let returned: unknown = 'unset'
    await act(async () => {
      returned = await result.current('c-other')
    })

    expect(returned).toBeNull()
    expect(listIds(client)).toEqual(['c1'])
  })
})

describe('moveConversationToTop', () => {
  const ref = (id: string) => ({ __ref: `ExtendConversationDTO:${id}` })
  const readId = (item: Reference) => item.__ref.split(':')[1]

  it('puts the conversation first and drops its other copy', () => {
    expect(
      moveConversationToTop(
        [ref('a'), ref('b'), ref('c')],
        ref('b'),
        readId,
        'b',
      ),
    ).toEqual([ref('b'), ref('a'), ref('c')])
  })

  it('adds a conversation the list did not have', () => {
    expect(moveConversationToTop([ref('a')], ref('z'), readId, 'z')).toEqual([
      ref('z'),
      ref('a'),
    ])
  })
})
