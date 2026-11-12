/** Local calendar today as YYYY-MM-DD (for date inputs / future checks). */
export function todayDateOnlyLocal(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/

export function isDateOnlyString(value: string): boolean {
  if (!DATE_ONLY_RE.test(value)) {
    return false
  }

  const parts = value.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false
  }

  const utc = new Date(Date.UTC(year, month - 1, day))

  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  )
}
