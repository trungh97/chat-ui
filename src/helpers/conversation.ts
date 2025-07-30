import { Message } from '@interfaces/dtos'
import { MessageGroupPosition } from '@interfaces/types'

/**
 * Determines the groupPosition for each message in a conversation.
 * @param messages Array of messages with senderId
 * @returns Array of groupPosition values: 'start' | 'middle' | 'end' | undefined
 */
export function getGroupPositions(messages: Message[]): MessageGroupPosition[] {
  return messages.map((msg, i) => {
    const prev = messages[i - 1]
    const next = messages[i + 1]

    return getGroupPosition(prev, msg, next)
  })
}

export function getGroupPosition(
  prev: Message | undefined,
  curr: Message,
  next: Message | undefined,
): MessageGroupPosition | undefined {
  const currId = curr.senderId
  const prevId = prev?.senderId
  const nextId = next?.senderId

  if (prevId !== currId && nextId === currId) {
    return 'start'
  }

  if (prevId === currId && nextId === currId) {
    return 'middle'
  }

  if (prevId === currId && nextId !== currId) {
    return 'end'
  }

  return undefined
}
