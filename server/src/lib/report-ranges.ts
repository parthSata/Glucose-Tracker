/**
 * Report date ranges from a selected calendar date (YYYY-MM-DD).
 * Never shift days via local timezone Date parsing.
 */

export type ReportDateRange = {
  start: string
  end: string
}

/** Month-to-date: 1st of selected month → selected date (inclusive). */
export function monthToDateRange(dateOnly: string): ReportDateRange {
  const [year, month] = dateOnly.split('-')
  return {
    start: `${year}-${month}-01`,
    end: dateOnly,
  }
}
