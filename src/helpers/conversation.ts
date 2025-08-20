// Standard time (in minutes) for grouping messages
import { Message } from '@interfaces/dtos'
import { MessagePosition } from '@interfaces/types'
import { getTimeDifference } from './date'

const GROUP_TIME_MINUTES = 5

/**
 * Determines the groupPosition for each message in a conversation.
 * @param messages Array of messages with senderId
 * @returns Array of groupPosition values: 'start' | 'middle' | 'end' | undefined
 */
export function getGroupPositions(messages: Message[]): MessagePosition[] {
  return messages.map((msg, i) => {
    const prev = messages[i - 1]
    const next = messages[i + 1]

    return getGroupPosition(prev, msg, next)
  })
}

/**
 * Given a message and its previous and next messages, determine the groupPosition for the message.
 * @param prev Previous message in the conversation, or undefined if none.
 * @param curr The current message.
 * @param next Next message in the conversation, or undefined if none.
 * @returns The group position for the message, one of 'start', 'middle', or 'end', or undefined if none.
 * The group position is determined as follows:
 * 1. If the message is the first in a group (no previous message, or different sender than previous message),
 *    or if the message is the last in a group (no next message, or different sender than next message),
 *    or if the time difference between the message and the previous or next message is > 5 minutes,
 *    then the group position is 'start' or 'end' respectively.
 * 2. If the message is in the middle of a group (same sender as previous and next messages, and time difference
 *    between the message and the previous or next message is <= 5 minutes), then the group position is 'middle'.
 * 3. If none of the above, then the group position is undefined.
 */
export function getGroupPosition(
  prev: Message | undefined,
  curr: Message,
  next: Message | undefined,
): MessagePosition {
  const currSender = curr.senderId
  const prevSender = prev?.senderId
  const nextSender = next?.senderId

  // Helper to get time difference in minutes, safely
  const diffWithPrev = prev
    ? getTimeDifference(prev.createdAt, curr.createdAt, 'minutes')
    : undefined
  const diffWithNext = next
    ? getTimeDifference(curr.createdAt, next.createdAt, 'minutes')
    : undefined

  // Case 1: New message appended (no next)
  if (prev && !next) {
    if (prevSender === currSender) {
      if (diffWithPrev !== undefined && diffWithPrev < GROUP_TIME_MINUTES)
        return 'end'
      return 'start'
    }
    return 'start'
  }

  // Case 2: Start of a group
  const isStart =
    (prevSender !== currSender ||
      (diffWithPrev !== undefined && diffWithPrev >= GROUP_TIME_MINUTES)) &&
    nextSender === currSender
  if (isStart) return 'start'

  // Case 3: Middle of a group
  const isMiddle =
    prevSender === currSender &&
    nextSender === currSender &&
    (diffWithPrev === undefined || diffWithPrev < GROUP_TIME_MINUTES) &&
    (diffWithNext === undefined || diffWithNext < GROUP_TIME_MINUTES)
  if (isMiddle) return 'middle'

  // Case 4: End of a group
  const isEnd =
    prevSender === currSender &&
    (nextSender !== currSender ||
      (diffWithNext !== undefined && diffWithNext >= GROUP_TIME_MINUTES))
  if (isEnd) return 'end'

  // Default: no group position
  return 'start'
}
