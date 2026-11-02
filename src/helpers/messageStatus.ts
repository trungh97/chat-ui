import { MessageDeliveryStatus } from '@constants/enums'
import type { TFunction } from 'i18next'

/** How many names "Seen by …" lists before switching to "and N others". */
const MAX_SEEN_BY_NAMES = 3

type MessagePointer = {
  id: string
  createdAt: string
}

export type StatusParticipant = {
  userId: string
  name: string
  lastSeenMessageId?: string | null
  lastSeenMessageAt?: string | null
  lastReceivedMessageId?: string | null
  lastReceivedMessageAt?: string | null
}

export type ConfirmedMessageStatus = {
  status:
    | MessageDeliveryStatus.SENT
    | MessageDeliveryStatus.DELIVERED
    | MessageDeliveryStatus.SEEN
  text: string
}

/**
 * Whether a participant's pointer (`pointerAt`, `pointerId`) is at or after `message`.
 * Messages are ordered by `(createdAt, id)`, the same order the server uses to move pointers.
 */
export const isPointerAtOrAfter = (
  pointerId: string | null | undefined,
  pointerAt: string | null | undefined,
  message: MessagePointer,
): boolean => {
  if (!pointerId || !pointerAt) return false

  const pointerTime = Date.parse(pointerAt)
  const messageTime = Date.parse(message.createdAt)

  if (pointerTime !== messageTime) return pointerTime > messageTime
  return pointerId >= message.id
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name

const formatSeenBy = (names: string[], t: TFunction): string => {
  if (names.length <= MAX_SEEN_BY_NAMES) {
    return t('message.status.seenBy', { names: names.join(', ') })
  }

  return t('message.status.seenByOthers', {
    names: names.slice(0, MAX_SEEN_BY_NAMES).join(', '),
    count: names.length - MAX_SEEN_BY_NAMES,
  })
}

/**
 * Derives the status of the current user's saved message from the other participants' last
 * seen/received pointers.
 *
 * - 1-1: Sent → Delivered → Seen.
 * - Group: Sent → "Seen by Bob, Alice" → "Seen by all". Groups never show Delivered.
 *
 * `t` translates the status text, so the result follows the current UI language.
 */
export const getMessageStatus = ({
  message,
  participants,
  currentUserId,
  isGroup,
  t,
}: {
  message: MessagePointer
  participants: StatusParticipant[]
  currentUserId: string
  isGroup: boolean
  t: TFunction
}): ConfirmedMessageStatus => {
  const others = participants.filter(
    (participant) => participant.userId !== currentUserId,
  )
  const seenBy = others.filter((participant) =>
    isPointerAtOrAfter(
      participant.lastSeenMessageId,
      participant.lastSeenMessageAt,
      message,
    ),
  )

  if (!isGroup) {
    const [other] = others

    if (!other)
      return {
        status: MessageDeliveryStatus.SENT,
        text: t('message.status.sent'),
      }
    if (seenBy.length > 0) {
      return {
        status: MessageDeliveryStatus.SEEN,
        text: t('message.status.seen'),
      }
    }
    if (
      isPointerAtOrAfter(
        other.lastReceivedMessageId,
        other.lastReceivedMessageAt,
        message,
      )
    ) {
      return {
        status: MessageDeliveryStatus.DELIVERED,
        text: t('message.status.delivered'),
      }
    }
    return {
      status: MessageDeliveryStatus.SENT,
      text: t('message.status.sent'),
    }
  }

  if (seenBy.length === 0) {
    return {
      status: MessageDeliveryStatus.SENT,
      text: t('message.status.sent'),
    }
  }
  if (seenBy.length === others.length) {
    return {
      status: MessageDeliveryStatus.SEEN,
      text: t('message.status.seenByAll'),
    }
  }
  return {
    status: MessageDeliveryStatus.SEEN,
    text: formatSeenBy(
      seenBy.map((participant) => firstName(participant.name)),
      t,
    ),
  }
}
