/** Calendar date helpers — never shift YYYY-MM-DD via local timezone parsing. */

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/

function parseDateParts(
  value: string,
): { year: number; month: number; day: number } | null {
  if (!DATE_ONLY_RE.test(value)) {
    return null
  }

  const parts = value.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null
  }

  return { year, month, day }
}

export function isDateOnlyString(value: string): boolean {
  const parts = parseDateParts(value)
  if (!parts) {
    return false
  }

  const utc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))

  return (
    utc.getUTCFullYear() === parts.year &&
    utc.getUTCMonth() === parts.month - 1 &&
    utc.getUTCDate() === parts.day
  )
}

/** Local calendar today as YYYY-MM-DD (for “not in the future” checks). */
export function todayDateOnlyLocal(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Store Prisma `@db.Date` as UTC midnight for the given calendar day. */
export function toDateOnlyUtc(dateOnly: string): Date {
  const parts = parseDateParts(dateOnly)
  if (!parts) {
    throw new Error(`Invalid date-only string: ${dateOnly}`)
  }

  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
}

export function formatDateOnlyUtc(date: Date): string {
  return date.toISOString().slice(0, 10)
}
