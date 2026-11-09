import { useGetDirectConversationLazyQuery } from '@generated/graphql'
import { useDraftConversationStore } from '@store/draftConversation'
import { act, renderHook } from '@testing-library/react'
import { useOpenDirectConversation } from '../useOpenDirectConversation'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('@generated/graphql', () => ({
  ...jest.requireActual('@generated/graphql'),
  useGetDirectConversationLazyQuery: jest.fn(),
}))

const ann = { id: 'u2', firstName: 'Ann', lastName: 'Lee', avatar: null }

describe('useOpenDirectConversation', () => {
  let getDirectConversation: jest.Mock

  beforeEach(() => {
    mockNavigate.mockReset()
    useDraftConversationStore.setState({ drafts: {} })
    getDirectConversation = jest.fn()
    jest
      .mocked(useGetDirectConversationLazyQuery)
      .mockReturnValue([getDirectConversation] as unknown as ReturnType<
        typeof useGetDirectConversationLazyQuery
      >)
  })

  const respond = (data: unknown, error: string | null = null) =>
    getDirectConversation.mockResolvedValue({
      data: { getDirectConversation: { data, error } },
    })

  it('opens the existing 1:1 conversation', async () => {
    respond({ id: 'c1' })
    const { result } = renderHook(() => useOpenDirectConversation())

    await act(() => result.current(ann))

    expect(getDirectConversation).toHaveBeenCalledWith({
      variables: { userId: 'u2' },
    })
    expect(mockNavigate).toHaveBeenCalledWith('/c1')
    expect(useDraftConversationStore.getState().drafts).toEqual({})
  })

  it('opens a draft when there is no 1:1 yet', async () => {
    respond(null)
    const { result } = renderHook(() => useOpenDirectConversation())

    await act(() => result.current(ann))

    expect(useDraftConversationStore.getState().drafts.u2).toEqual(
      expect.objectContaining({ userId: 'u2', name: 'Ann Lee', avatar: null }),
    )
    expect(mockNavigate).toHaveBeenCalledWith('/new/u2')
  })

  it('rejects, without navigating, when the lookup fails', async () => {
    respond(null, 'Something went wrong')
    const { result } = renderHook(() => useOpenDirectConversation())

    await expect(result.current(ann)).rejects.toThrow('Something went wrong')
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(useDraftConversationStore.getState().drafts).toEqual({})
  })
})
