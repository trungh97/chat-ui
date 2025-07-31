import { Message } from '@interfaces/dtos'
import { MessageGroupPosition } from '@interfaces/types'
import { getTimeDifference } from './date'

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

  // Special case: only prev and curr (new message appended)
  if (prev && !next) {
    if (prevId === currId) {
      const diff = getTimeDifference(prev.createdAt, curr.createdAt, 'minutes')
      if (diff < 5) {
        return 'end'
      } else {
        return 'start'
      }
    } else {
      return 'start'
    }
  }

  // If previous is not same sender, or time diff > 5 min, and next is same sender: start
  if (
    (prevId !== currId ||
      (prev &&
        getTimeDifference(prev.createdAt, curr.createdAt, 'minutes') > 5)) &&
    nextId === currId
  ) {
    return 'start'
  }

  // If previous is same sender, next is same sender, and time diff with prev/next <= 5 min: middle
  if (
    prevId === currId &&
    nextId === currId &&
    (!prev ||
      getTimeDifference(prev.createdAt, curr.createdAt, 'minutes') <= 5) &&
    (!next || getTimeDifference(curr.createdAt, next.createdAt, 'minutes') <= 5)
  ) {
    return 'middle'
  }

  // If previous is same sender, and (next is not same sender or time diff > 5 min): end
  if (
    prevId === currId &&
    (nextId !== currId ||
      (next &&
        getTimeDifference(curr.createdAt, next.createdAt, 'minutes') > 5))
  ) {
    return 'end'
  }

  return undefined
}
