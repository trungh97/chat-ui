import {
  format,
  formatDistanceToNow,
  FormatDistanceToNowOptions,
  isToday,
  parseISO,
} from 'date-fns'

/**
 * Formats an ISO 8601 date string:
 * - If the date is today, returns 'HH:mm'
 * - Otherwise, returns 'EEEE, MMM d'
 * @param isoString ISO 8601 date string
 */
export function formatChatDate(isoString: string): string {
  const date = parseISO(isoString)
  if (isToday(date)) {
    return format(date, 'HH:mm')
  }
  return format(date, 'EEEE, MMM d')
}

/**
 * Formats an ISO 8601 date string as a relative time from now (e.g., "2 hours ago", "3 days ago").
 * @param isoString ISO 8601 date string
 */
export function formatRelativeToNow(
  isoString: string,
  options?: FormatDistanceToNowOptions,
): string {
  const date = parseISO(isoString)
  return formatDistanceToNow(date, options)
}

/**
 * Calculates the difference between two ISO 8601 date strings in the specified unit.
 * @param isoString1 First ISO 8601 date string
 * @param isoString2 Second ISO 8601 date string
 * @param unit The unit for the difference: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days'
 * @returns The difference as a positive integer in the specified unit
 */
export function getTimeDifference(
  isoString1: string,
  isoString2: string,
  unit:
    | 'milliseconds'
    | 'seconds'
    | 'minutes'
    | 'hours'
    | 'days' = 'milliseconds',
): number {
  const date1 = parseISO(isoString1)
  const date2 = parseISO(isoString2)
  const diffMs = Math.abs(date1.getTime() - date2.getTime())
  switch (unit) {
    case 'seconds':
      return Math.floor(diffMs / 1000)
    case 'minutes':
      return Math.floor(diffMs / (1000 * 60))
    case 'hours':
      return Math.floor(diffMs / (1000 * 60 * 60))
    case 'days':
      return Math.floor(diffMs / (1000 * 60 * 60 * 24))
    default:
      return diffMs
  }
}
