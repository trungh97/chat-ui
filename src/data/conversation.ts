import { ConversationType, ExtendConversationDto } from '@generated/graphql'
import { Conversation } from '@interfaces/dtos'
import {
  DraftConversation,
  draftConversationKey,
} from '@store/draftConversation'

export class ConversationData {
  static toBaseConversation(data: ExtendConversationDto): Conversation {
    const { participants = [], messages = [] } = data
    return {
      id: data.id,
      title: data.title!,
      avatar: data.groupAvatar || data.defaultGroupAvatars?.[0] || '',
      lastMessage: messages?.[0]?.content || '',
      lastMessageTime:
        data.messages?.[0]?.createdAt || new Date().toISOString(),
      isRead: false,
      numberOfPaticipants: participants.length || 0,
      isGroup: data.type === ConversationType.Group,
    }
  }

  /**
   * Transform the raw data received from the server into a list of Conversation DTOs.
   *
   * @param {GetMyLatestConversationsQuery | undefined} data - The raw data received from the server.
   * @return {Conversation[]} An array of Conversation DTOs.
   */
  static toBaseConversationList(data: ExtendConversationDto[]): Conversation[] {
    return data.map(this.toBaseConversation)
  }

  /** A draft as a chat list item. It opens the draft route instead of `/<id>`. */
  static fromDraft(draft: DraftConversation): Conversation {
    return {
      id: draftConversationKey(draft.userId),
      path: `/new/${draft.userId}`,
      title: draft.name,
      avatar: draft.avatar ?? '',
      lastMessage: '',
      lastMessageTime: draft.createdAt,
      isRead: true,
      numberOfPaticipants: 2,
      isGroup: false,
    }
  }
}
