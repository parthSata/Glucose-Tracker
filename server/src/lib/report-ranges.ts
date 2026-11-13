/**
 * Report date ranges from a selected calendar date (YYYY-MM-DD).
 * Never shift days via local timezone Date parsing.
 */

export type ReportDateRange = {
  start: string
  end: string
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/** Last calendar day of a 1-based month (UTC math, no local TZ shift). */
function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** Month-to-date: 1st of selected month → selected date (inclusive). */
export function monthToDateRange(dateOnly: string): ReportDateRange {
  const [year, month] = dateOnly.split('-')
  return {
    start: `${year}-${month}-01`,
    end: dateOnly,
  }
}

/**
 * Monthly report: entire **previous** calendar month relative to the
 * selected date (e.g. 2026-10-15 → 2026-09-01 … 2026-09-30).
 */
export function previousMonthRange(dateOnly: string): ReportDateRange {
  const [yearPart, monthPart] = dateOnly.split('-')
  let year = Number(yearPart)
  let month = Number(monthPart)

  month -= 1
  if (month === 0) {
    month = 12
    year -= 1
  }

  const lastDay = lastDayOfMonth(year, month)

  return {
    start: `${year}-${pad2(month)}-01`,
    end: `${year}-${pad2(month)}-${pad2(lastDay)}`,
  }
}
