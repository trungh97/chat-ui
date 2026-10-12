import { MessageGroupPosition } from '@constants/enums'
import { MessageType } from '@generated/graphql'
import { Message } from '@interfaces/dtos'
import { PendingMessage } from '@store/pendingMessage'
import { MessageData } from '../message'

const saved = (
  id: string,
  senderId: string,
  createdAt: string,
  clientMessageId: string | null = null,
): Message => ({
  id,
  content: id,
  messageType: MessageType.Text,
  senderId,
  conversationId: 'c1',
  createdAt,
  groupPosition: MessageGroupPosition.start,
  clientMessageId,
})

const pending = (
  clientMessageId: string,
  createdAt: string,
  status: PendingMessage['status'] = 'SENDING',
): PendingMessage => ({
  clientMessageId,
  conversationId: 'c1',
  content: clientMessageId,
  createdAt,
  status,
})

describe('MessageData.withPendingMessages', () => {
  const messages = [
    saved('m1', 'bob', '2026-10-01T10:00:00.000Z'),
    saved('m2', 'me', '2026-10-01T10:01:00.000Z', 'client-0'),
  ]

  it('returns the saved messages unchanged when nothing is pending', () => {
    expect(
      MessageData.withPendingMessages({
        messages,
        pendingMessages: [],
        currentUserId: 'me',
      }),
    ).toBe(messages)
  })

  it('appends pending messages oldest first, sent by the current user', () => {
    const result = MessageData.withPendingMessages({
      messages,
      pendingMessages: [
        pending('client-2', '2026-10-01T10:03:00.000Z', 'ERROR'),
        pending('client-1', '2026-10-01T10:02:00.000Z'),
      ],
      currentUserId: 'me',
    })

    expect(result.map(({ id }) => id)).toEqual([
      'm1',
      'm2',
      'client-1',
      'client-2',
    ])
    expect(result[2]).toEqual(
      expect.objectContaining({
        senderId: 'me',
        content: 'client-1',
        pendingStatus: 'SENDING',
      }),
    )
    expect(result[3].pendingStatus).toBe('ERROR')
    expect(result[0].pendingStatus).toBeUndefined()
  })

  it('groups pending messages with the saved messages before them', () => {
    const result = MessageData.withPendingMessages({
      messages,
      pendingMessages: [pending('client-1', '2026-10-01T10:02:00.000Z')],
      currentUserId: 'me',
    })

    expect(result.map(({ groupPosition }) => groupPosition)).toEqual([
      'start',
      'start',
      'end',
    ])
  })

  it('skips a pending message that is already saved', () => {
    const result = MessageData.withPendingMessages({
      messages,
      pendingMessages: [pending('client-0', '2026-10-01T10:01:00.000Z')],
      currentUserId: 'me',
    })

    expect(result).toBe(messages)
  })
})
