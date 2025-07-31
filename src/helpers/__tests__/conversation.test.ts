import { getGroupPosition, getGroupPositions } from '@helpers/conversation'
import { Message } from '@interfaces/dtos'

const makeMsg = (
  id: string,
  senderId: string,
  createdAt: string,
  groupPosition?: any,
): Message => ({
  id,
  content: '',
  messageType: 'text',
  senderId,
  conversationId: 'c1',
  createdAt,
  groupPosition,
})

describe('getGroupPositions', () => {
  const now = new Date('2025-07-31T12:00:00Z')
  const base = now.toISOString()
  const plus1m = new Date(now.getTime() + 1 * 60 * 1000).toISOString()
  const plus4m = new Date(now.getTime() + 4 * 60 * 1000).toISOString()
  const plus6m = new Date(now.getTime() + 6 * 60 * 1000).toISOString()

  it('returns correct group positions for a single message', () => {
    const msgs = [makeMsg('1', 'A', base)]
    expect(getGroupPositions(msgs)).toEqual(['start'])
  })

  it('returns correct group positions for two messages, same sender under 5 min', () => {
    const msgs = [makeMsg('1', 'A', base), makeMsg('2', 'A', plus4m)]
    expect(getGroupPositions(msgs)).toEqual(['start', 'end'])
  })

  it('returns correct group positions for two messages, same sender over 5 min', () => {
    const msgs = [makeMsg('1', 'A', base), makeMsg('2', 'A', plus6m)]
    expect(getGroupPositions(msgs)).toEqual(['start', 'start'])
  })

  it('returns correct group positions for two messages, different senders', () => {
    const msgs = [makeMsg('1', 'A', base), makeMsg('2', 'B', plus1m)]
    expect(getGroupPositions(msgs)).toEqual(['start', 'start'])
  })

  it('returns correct group positions for a group of three', () => {
    const msgs = [
      makeMsg('1', 'A', base),
      makeMsg('2', 'A', plus1m),
      makeMsg('3', 'A', plus4m),
    ]
    expect(getGroupPositions(msgs)).toEqual(['start', 'middle', 'end'])
  })

  it('returns correct group positions for a group with time gap', () => {
    const msgs = [
      makeMsg('1', 'A', base),
      makeMsg('2', 'A', plus1m),
      makeMsg('3', 'A', plus6m),
    ]
    expect(getGroupPositions(msgs)).toEqual(['start', 'end', 'start'])
  })

  it('returns correct group positions for mixed senders and gaps', () => {
    const msgs = [
      makeMsg('1', 'A', base),
      makeMsg('2', 'A', plus1m),
      makeMsg('3', 'B', plus4m),
      makeMsg('4', 'B', plus6m),
      makeMsg('5', 'A', plus6m),
    ]
    expect(getGroupPositions(msgs)).toEqual([
      'start',
      'end',
      'start',
      'end',
      'start',
    ])
  })
})

describe('getGroupPosition', () => {
  const now = new Date('2025-07-31T12:00:00Z')
  const plus1m = new Date(now.getTime() + 1 * 60 * 1000).toISOString()
  const plus4m = new Date(now.getTime() + 4 * 60 * 1000).toISOString()
  const plus6m = new Date(now.getTime() + 6 * 60 * 1000).toISOString()
  const base = now.toISOString()

  it('returns start for first message', () => {
    const curr = makeMsg('1', 'A', base)
    expect(getGroupPosition(undefined, curr, undefined)).toBe('start')
  })

  it('returns start for new sender', () => {
    const prev = makeMsg('1', 'A', base)
    const curr = makeMsg('2', 'B', plus1m)
    expect(getGroupPosition(prev, curr, undefined)).toBe('start')
  })

  it('returns end for consecutive same sender under 5 min', () => {
    const prev = makeMsg('1', 'A', base)
    const curr = makeMsg('2', 'A', plus4m)
    expect(getGroupPosition(prev, curr, undefined)).toBe('end')
  })

  it('returns start for consecutive same sender over 5 min', () => {
    const prev = makeMsg('1', 'A', base)
    const curr = makeMsg('2', 'A', plus6m)
    expect(getGroupPosition(prev, curr, undefined)).toBe('start')
  })

  it('returns middle for surrounded by same sender within 5 min', () => {
    const prev = makeMsg('1', 'A', base)
    const curr = makeMsg('2', 'A', plus1m)
    const next = makeMsg('3', 'A', plus4m)
    expect(getGroupPosition(prev, curr, next)).toBe('middle')
  })

  it('returns start for start of group', () => {
    const prev = makeMsg('1', 'B', base)
    const curr = makeMsg('2', 'A', plus1m)
    const next = makeMsg('3', 'A', plus4m)
    expect(getGroupPosition(prev, curr, next)).toBe('start')
  })

  it('returns end for end of group', () => {
    const prev = makeMsg('1', 'A', base)
    const curr = makeMsg('2', 'A', plus1m)
    const next = makeMsg('3', 'B', plus4m)
    expect(getGroupPosition(prev, curr, next)).toBe('end')
  })

  it('returns end for time gap > 5 min to next', () => {
    const prev = makeMsg('1', 'A', base)
    const curr = makeMsg('2', 'A', plus1m)
    const next = makeMsg('3', 'A', plus6m)
    expect(getGroupPosition(prev, curr, next)).toBe('end')
  })

  it('returns start for time gap > 5 min to prev', () => {
    const prev = makeMsg('1', 'A', base)
    const curr = makeMsg('2', 'A', plus6m)
    const next = makeMsg('3', 'A', plus6m)
    expect(getGroupPosition(prev, curr, next)).toBe('start')
  })
})
