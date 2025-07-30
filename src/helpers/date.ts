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
