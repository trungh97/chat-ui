import { act, renderHook } from '@testing-library/react'
import { useCreateMessageMutation } from '@generated/graphql'
import { useDraftConversationStore } from '@store/draftConversation'
import { usePendingMessageStore } from '@store/pendingMessage'
import { useSendMessage } from '../useSendMessage'

let mockParams: { conversationId?: string; userId?: string } = {
  conversationId: 'c1',
}
let mockPathname = '/c1'
const mockNavigate = jest.fn()
const mockAddConversationToList = jest.fn()

jest.mock('react-router-dom', () => ({
  useParams: () => mockParams,
  useLocation: () => ({ pathname: mockPathname }),
  useNavigate: () => mockNavigate,
}))

jest.mock('@hooks/conversations/useAddConversationToList', () => ({
  useAddConversationToList: () => mockAddConversationToList,
}))

jest.mock('@generated/graphql', () => ({
  ...jest.requireActual('@generated/graphql'),
  useCreateMessageMutation: jest.fn(),
}))

const mockedUseCreateMessageMutation = jest.mocked(useCreateMessageMutation)

const savedMessageResponse = (clientMessageId: string) => ({
  data: {
    createMessage: {
      statusCode: 201,
      data: { id: 'm1', conversationId: 'c1', clientMessageId },
      error: null,
    },
  },
})

const pendingMessages = () =>
  Object.values(usePendingMessageStore.getState().pendingMessages)

describe('useSendMessage', () => {
  let createMessage: jest.Mock

  beforeEach(() => {
    mockParams = { conversationId: 'c1' }
    mockPathname = '/c1'
    mockNavigate.mockReset()
    mockAddConversationToList.mockReset().mockResolvedValue(null)
    usePendingMessageStore.setState({ pendingMessages: {} })
    useDraftConversationStore.setState({ drafts: {} })
    createMessage = jest.fn()
    mockedUseCreateMessageMutation.mockReturnValue([
      createMessage,
    ] as unknown as ReturnType<typeof useCreateMessageMutation>)
  })

  it('shows the message as sending, then removes it once saved', async () => {
    let resolveMutation: (value: unknown) => void = () => {}
    createMessage.mockReturnValue(
      new Promise((resolve) => {
        resolveMutation = resolve
      }),
    )
    const { result } = renderHook(() => useSendMessage())

    let submitting: Promise<void> = Promise.resolve()
    act(() => {
      submitting = result.current.handleSubmit('hello')
    })

    expect(pendingMessages()).toEqual([
      expect.objectContaining({
        conversationId: 'c1',
        content: 'hello',
        status: 'SENDING',
      }),
    ])
    expect(result.current.value).toBe('')

    const { clientMessageId } = pendingMessages()[0]
    expect(createMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          request: expect.objectContaining({
            conversationId: 'c1',
            content: 'hello',
            clientMessageId,
          }),
        },
      }),
    )

    await act(async () => {
      resolveMutation(savedMessageResponse(clientMessageId))
      await submitting
    })

    expect(pendingMessages()).toEqual([])
  })

  it('keeps the content and marks the message as failed when sending fails', async () => {
    createMessage.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => useSendMessage())

    await act(() => result.current.handleSubmit('hello'))

    expect(pendingMessages()).toEqual([
      expect.objectContaining({ content: 'hello', status: 'ERROR' }),
    ])
  })

  it('marks the message as failed when the server returns an error', async () => {
    createMessage.mockResolvedValue({
      data: {
        createMessage: { statusCode: 400, data: null, error: 'Not allowed' },
      },
    })
    const { result } = renderHook(() => useSendMessage())

    await act(() => result.current.handleSubmit('hello'))

    expect(pendingMessages()[0].status).toBe('ERROR')
  })

  it('retries a failed message with the same client message id', async () => {
    createMessage.mockRejectedValueOnce(new Error('network down'))
    const { result } = renderHook(() => useSendMessage())

    await act(() => result.current.handleSubmit('hello'))
    const { clientMessageId } = pendingMessages()[0]

    createMessage.mockResolvedValueOnce(savedMessageResponse(clientMessageId))
    await act(() => result.current.retry(clientMessageId))

    expect(createMessage).toHaveBeenCalledTimes(2)
    expect(
      createMessage.mock.calls[1][0].variables.request.clientMessageId,
    ).toBe(clientMessageId)
    expect(pendingMessages()).toEqual([])
  })

  it('does not send an empty message', async () => {
    const { result } = renderHook(() => useSendMessage())

    await act(() => result.current.handleSubmit('   '))

    expect(createMessage).not.toHaveBeenCalled()
    expect(pendingMessages()).toEqual([])
  })

  describe('from a draft', () => {
    beforeEach(() => {
      mockParams = { userId: 'u2' }
      mockPathname = '/new/u2'
      useDraftConversationStore.getState().addDraft({
        userId: 'u2',
        name: 'Ann Lee',
        avatar: null,
        createdAt: '2026-11-08T10:00:00.000Z',
      })
    })

    const savedInNewConversation = (clientMessageId: string) => ({
      data: {
        createMessage: {
          statusCode: 201,
          data: { id: 'm1', conversationId: 'c-new', clientMessageId },
          error: null,
        },
      },
    })

    it('sends the first message to the recipient, with no conversation id', async () => {
      let resolveMutation: (value: unknown) => void = () => {}
      createMessage.mockReturnValue(
        new Promise((resolve) => {
          resolveMutation = resolve
        }),
      )
      const { result } = renderHook(() => useSendMessage())

      let submitting: Promise<void> = Promise.resolve()
      act(() => {
        submitting = result.current.handleSubmit('hi')
      })

      const [pending] = pendingMessages()
      expect(pending).toEqual(
        expect.objectContaining({
          conversationId: 'draft:u2',
          status: 'SENDING',
        }),
      )
      const { request } = createMessage.mock.calls[0][0].variables
      expect(request).toEqual(
        expect.objectContaining({ content: 'hi', receivers: ['u2'] }),
      )
      expect(request).not.toHaveProperty('conversationId')

      await act(async () => {
        resolveMutation(savedInNewConversation(pending.clientMessageId))
        await submitting
      })
    })

    it('turns the draft into the saved conversation once the message is saved', async () => {
      createMessage.mockImplementation(({ variables }) =>
        Promise.resolve(
          savedInNewConversation(variables.request.clientMessageId),
        ),
      )
      const { result } = renderHook(() => useSendMessage())

      await act(() => result.current.handleSubmit('hi'))

      // The message stays visible under the new conversation until its messages load.
      expect(pendingMessages()).toEqual([
        expect.objectContaining({ conversationId: 'c-new', content: 'hi' }),
      ])
      expect(useDraftConversationStore.getState().drafts).toEqual({})
      expect(mockAddConversationToList).toHaveBeenCalledWith('c-new')
      expect(mockNavigate).toHaveBeenCalledWith('/c-new', { replace: true })
    })

    it('does not move a user who already left the draft', async () => {
      let resolveMutation: (value: unknown) => void = () => {}
      createMessage.mockReturnValue(
        new Promise((resolve) => {
          resolveMutation = resolve
        }),
      )
      const { result, rerender } = renderHook(() => useSendMessage())

      let submitting: Promise<void> = Promise.resolve()
      act(() => {
        submitting = result.current.handleSubmit('hi')
      })
      const [pending] = pendingMessages()

      mockPathname = '/c-other'
      rerender()
      await act(async () => {
        resolveMutation(savedInNewConversation(pending.clientMessageId))
        await submitting
      })

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(useDraftConversationStore.getState().drafts).toEqual({})
    })

    it('keeps the draft and marks the message as failed when sending fails', async () => {
      createMessage.mockRejectedValue(new Error('network down'))
      const { result } = renderHook(() => useSendMessage())

      await act(() => result.current.handleSubmit('hi'))

      expect(pendingMessages()).toEqual([
        expect.objectContaining({
          conversationId: 'draft:u2',
          status: 'ERROR',
        }),
      ])
      expect(useDraftConversationStore.getState().drafts).toHaveProperty('u2')
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('retries a failed first message to the recipient again', async () => {
      createMessage.mockRejectedValueOnce(new Error('network down'))
      const { result } = renderHook(() => useSendMessage())

      await act(() => result.current.handleSubmit('hi'))
      const { clientMessageId } = pendingMessages()[0]

      createMessage.mockResolvedValueOnce(
        savedInNewConversation(clientMessageId),
      )
      await act(() => result.current.retry(clientMessageId))

      expect(createMessage.mock.calls[1][0].variables.request).toEqual(
        expect.objectContaining({ clientMessageId, receivers: ['u2'] }),
      )
      expect(mockNavigate).toHaveBeenCalledWith('/c-new', { replace: true })
    })
  })
})
