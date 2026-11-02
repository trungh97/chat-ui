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
