import { act, renderHook } from '@testing-library/react'
import { useCreateMessageMutation } from '@generated/graphql'
import { usePendingMessageStore } from '@store/pendingMessage'
import { useSendMessage } from '../useSendMessage'

jest.mock('react-router-dom', () => ({
  useParams: () => ({ conversationId: 'c1' }),
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
    usePendingMessageStore.setState({ pendingMessages: {} })
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
})
