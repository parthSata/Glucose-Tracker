import { isDateOnlyString } from '@/lib/date-only'

function toLocalDate(dateOnly: string): Date | null {
  if (!isDateOnlyString(dateOnly)) {
    return null
  }

  const [year, month, day] = dateOnly.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Human-readable calendar date, e.g. "Friday, 13 November 2026". */
export function formatDisplayDate(dateOnly: string): string {
  const date = toLocalDate(dateOnly)
  if (!date) {
    return dateOnly
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Shorter label for ranges, e.g. "15 Oct 2026". */
export function formatDisplayDateShort(dateOnly: string): string {
  const date = toLocalDate(dateOnly)
  if (!date) {
    return dateOnly
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Single day → full label; span → "1 Oct 2026 – 15 Oct 2026". */
export function formatDisplayDateRange(start: string, end: string): string {
  if (start === end) {
    return formatDisplayDate(start)
  }

  return `${formatDisplayDateShort(start)} – ${formatDisplayDateShort(end)}`
}
