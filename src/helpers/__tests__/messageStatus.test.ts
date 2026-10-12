import { MessageDeliveryStatus } from '@constants/enums'
import {
  getMessageStatus,
  isPointerAtOrAfter,
  StatusParticipant,
} from '../messageStatus'

const message = { id: 'm-500', createdAt: '2026-10-01T10:00:00.000Z' }
const before = { id: 'm-100', at: '2026-10-01T09:00:00.000Z' }
const after = { id: 'm-900', at: '2026-10-01T11:00:00.000Z' }

const me: StatusParticipant = { userId: 'me', name: 'Me Myself' }

const participant = (
  userId: string,
  name: string,
  pointers: {
    seen?: { id: string; at: string }
    received?: { id: string; at: string }
  } = {},
): StatusParticipant => ({
  userId,
  name,
  lastSeenMessageId: pointers.seen?.id,
  lastSeenMessageAt: pointers.seen?.at,
  lastReceivedMessageId: pointers.received?.id,
  lastReceivedMessageAt: pointers.received?.at,
})

describe('isPointerAtOrAfter', () => {
  it('is false without a pointer', () => {
    expect(isPointerAtOrAfter(null, null, message)).toBe(false)
  })

  it('compares by createdAt first', () => {
    expect(isPointerAtOrAfter(before.id, before.at, message)).toBe(false)
    expect(isPointerAtOrAfter(after.id, after.at, message)).toBe(true)
  })

  it('breaks createdAt ties by id', () => {
    expect(isPointerAtOrAfter('m-500', message.createdAt, message)).toBe(true)
    expect(isPointerAtOrAfter('m-600', message.createdAt, message)).toBe(true)
    expect(isPointerAtOrAfter('m-400', message.createdAt, message)).toBe(false)
  })
})

describe('getMessageStatus', () => {
  describe('1-1 conversation', () => {
    const status = (other: StatusParticipant) =>
      getMessageStatus({
        message,
        participants: [me, other],
        currentUserId: 'me',
        isGroup: false,
      })

    it('is Sent when the other participant has not received it', () => {
      expect(
        status(participant('bob', 'Bob Stone', { received: before })),
      ).toEqual({ status: MessageDeliveryStatus.SENT, text: 'Sent' })
    })

    it('is Delivered when received but not seen', () => {
      expect(
        status(
          participant('bob', 'Bob Stone', { received: after, seen: before }),
        ),
      ).toEqual({ status: MessageDeliveryStatus.DELIVERED, text: 'Delivered' })
    })

    it('is Seen when seen, even if the received pointer is behind', () => {
      expect(status(participant('bob', 'Bob Stone', { seen: after }))).toEqual({
        status: MessageDeliveryStatus.SEEN,
        text: 'Seen',
      })
    })

    it('is Sent when the other participant is unknown', () => {
      expect(
        getMessageStatus({
          message,
          participants: [me],
          currentUserId: 'me',
          isGroup: false,
        }),
      ).toEqual({ status: MessageDeliveryStatus.SENT, text: 'Sent' })
    })
  })

  describe('group conversation', () => {
    const status = (others: StatusParticipant[]) =>
      getMessageStatus({
        message,
        participants: [me, ...others],
        currentUserId: 'me',
        isGroup: true,
      })

    it('is Sent and never Delivered while nobody has seen it', () => {
      expect(
        status([
          participant('bob', 'Bob Stone', { received: after }),
          participant('alice', 'Alice Wu', { received: after }),
        ]),
      ).toEqual({ status: MessageDeliveryStatus.SENT, text: 'Sent' })
    })

    it('lists first names of who has seen it', () => {
      expect(
        status([
          participant('bob', 'Bob Stone', { seen: after }),
          participant('alice', 'Alice Wu', { seen: after }),
          participant('carol', 'Carol King', { seen: before }),
        ]),
      ).toEqual({
        status: MessageDeliveryStatus.SEEN,
        text: 'Seen by Bob, Alice',
      })
    })

    it('is Seen by all when every other participant has seen it', () => {
      expect(
        status([
          participant('bob', 'Bob Stone', { seen: after }),
          // Alice's pointer is exactly this message
          participant('alice', 'Alice Wu', {
            seen: { id: message.id, at: message.createdAt },
          }),
        ]),
      ).toEqual({ status: MessageDeliveryStatus.SEEN, text: 'Seen by all' })
    })

    it('ignores the current user when deciding Seen by all', () => {
      expect(
        getMessageStatus({
          message,
          participants: [
            participant('me', 'Me Myself', { seen: before }),
            participant('bob', 'Bob Stone', { seen: after }),
          ],
          currentUserId: 'me',
          isGroup: true,
        }),
      ).toEqual({ status: MessageDeliveryStatus.SEEN, text: 'Seen by all' })
    })

    it('truncates after 3 names', () => {
      const seen = { seen: after }
      expect(
        status([
          participant('a', 'Ann A', seen),
          participant('b', 'Ben B', seen),
          participant('c', 'Cat C', seen),
          participant('d', 'Dan D', seen),
          participant('e', 'Eve E', seen),
          participant('f', 'Fay F'),
        ]).text,
      ).toBe('Seen by Ann, Ben, Cat and 2 others')
    })

    it('uses "other" for a single remaining name', () => {
      const seen = { seen: after }
      expect(
        status([
          participant('a', 'Ann A', seen),
          participant('b', 'Ben B', seen),
          participant('c', 'Cat C', seen),
          participant('d', 'Dan D', seen),
          participant('f', 'Fay F'),
        ]).text,
      ).toBe('Seen by Ann, Ben, Cat and 1 other')
    })
  })
})
