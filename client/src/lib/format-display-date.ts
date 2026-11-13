import { isDateOnlyString } from '@/lib/date-only'

/** Human-readable calendar date, e.g. "Friday, 13 November 2026". */
export function formatDisplayDate(dateOnly: string): string {
  if (!isDateOnlyString(dateOnly)) {
    return dateOnly
  }

  const [year, month, day] = dateOnly.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
