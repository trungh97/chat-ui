import { formatChatDate, formatRelativeToNow } from '../date'

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
