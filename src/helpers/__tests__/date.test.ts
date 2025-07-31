import { formatChatDate, formatRelativeToNow, getTimeDifference } from '../date'

describe('formatChatDate', () => {
  it("should format today's date as HH:mm", () => {
    const now = new Date()
    const iso = now.toISOString()
    const result = formatChatDate(iso)
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })

  it('should format previous date as EEEE, MMM d', () => {
    const date = new Date('2020-01-01T12:00:00Z')
    const iso = date.toISOString()
    const result = formatChatDate(iso)
    expect(result).toMatch(/\w+, \w+ \d{1,2}/)
  })
})

describe('formatRelativeToNow', () => {
  it('should return "less than a minute" for now', () => {
    const now = new Date()
    const iso = now.toISOString()
    const result = formatRelativeToNow(iso, { addSuffix: true })
    expect(result).toMatch(/less than a minute|seconds? ago/)
  })

  it('should return "1 day ago" for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const iso = yesterday.toISOString()
    const result = formatRelativeToNow(iso, { addSuffix: true })
    expect(result).toMatch(/1 day ago/)
  })

  it('should return "about 1 month ago" for a date 31 days ago', () => {
    const monthAgo = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
    const iso = monthAgo.toISOString()
    const result = formatRelativeToNow(iso, { addSuffix: true })
    expect(result).toMatch(/month ago/)
  })
})

describe('getTimeDifference', () => {
  const base = new Date('2025-07-31T12:00:00Z')
  const plus1s = new Date(base.getTime() + 1000)
  const plus1m = new Date(base.getTime() + 60 * 1000)
  const plus1h = new Date(base.getTime() + 60 * 60 * 1000)
  const plus1d = new Date(base.getTime() + 24 * 60 * 60 * 1000)

  it('should return 1000 milliseconds for 1 second difference with default unit', () => {
    expect(getTimeDifference(base.toISOString(), plus1s.toISOString())).toBe(
      1000,
    )
  })

  it('should return 1000 milliseconds for 1 second difference', () => {
    expect(
      getTimeDifference(
        base.toISOString(),
        plus1s.toISOString(),
        'milliseconds',
      ),
    ).toBe(1000)
  })

  it('should return 1 second for 1 second difference', () => {
    expect(
      getTimeDifference(base.toISOString(), plus1s.toISOString(), 'seconds'),
    ).toBe(1)
  })

  it('should return 1 minute for 1 minute difference', () => {
    expect(
      getTimeDifference(base.toISOString(), plus1m.toISOString(), 'minutes'),
    ).toBe(1)
  })

  it('should return 1 hour for 1 hour difference', () => {
    expect(
      getTimeDifference(base.toISOString(), plus1h.toISOString(), 'hours'),
    ).toBe(1)
  })

  it('should return 1 day for 1 day difference', () => {
    expect(
      getTimeDifference(base.toISOString(), plus1d.toISOString(), 'days'),
    ).toBe(1)
  })

  it('should return 0 for same time', () => {
    expect(
      getTimeDifference(base.toISOString(), base.toISOString(), 'milliseconds'),
    ).toBe(0)
  })

  it('should be symmetric (order does not matter)', () => {
    expect(
      getTimeDifference(plus1h.toISOString(), base.toISOString(), 'hours'),
    ).toBe(1)
  })
})
