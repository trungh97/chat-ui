import {
  ConversationType,
  ExtendConversationDto,
  MessageType,
} from '@generated/graphql'
import { ConversationData } from '../conversation'

const conversation = (
  messages: ExtendConversationDto['messages'],
): ExtendConversationDto => ({
  id: 'c-1',
  creatorId: 'u-1',
  isArchived: false,
  title: 'Team',
  type: ConversationType.Group,
  participants: [],
  messages,
})

describe('ConversationData.toBaseConversation', () => {
  it('uses the latest message as the last message', () => {
    const result = ConversationData.toBaseConversation(
      conversation([
        {
          id: 'm-1',
          content: 'Hello',
          conversationId: 'c-1',
          createdAt: '2026-10-01T10:00:00.000Z',
          messageType: MessageType.Text,
        },
      ]),
    )

    expect(result.lastMessage).toBe('Hello')
    expect(result.lastMessageTime).toBe('2026-10-01T10:00:00.000Z')
  })

  // The UI renders the translated "No messages yet", so the cached model stays language-neutral
  it('leaves the last message empty when there are no messages', () => {
    expect(
      ConversationData.toBaseConversation(conversation([])).lastMessage,
    ).toBe('')
  })
})

describe('ConversationData.fromDraft', () => {
  it('maps a draft to a chat list item that opens the draft route', () => {
    expect(
      ConversationData.fromDraft({
        userId: 'u-2',
        name: 'Ann Lee',
        avatar: null,
        createdAt: '2026-11-08T10:00:00.000Z',
      }),
    ).toEqual({
      id: 'draft:u-2',
      path: '/new/u-2',
      title: 'Ann Lee',
      avatar: '',
      lastMessage: '',
      lastMessageTime: '2026-11-08T10:00:00.000Z',
      isRead: true,
      numberOfPaticipants: 2,
      isGroup: false,
    })
  })
})
