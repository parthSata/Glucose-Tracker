import type { TimeSlotValue } from '@/lib/time-slots'

export type ReportKind = 'daily' | 'month-to-date'

export type ReportReadingItem = {
  id: string
  readingDate: string
  timeSlot: TimeSlotValue
  value: number
}

export type ReportRange = {
  start: string
  end: string
}

/** Shared stats payload for all report types. */
export type ReportSummaryData = {
  range: ReportRange
  highest: number | null
  lowest: number | null
  average: number | null
  count: number
}

export type DailyReport = ReportSummaryData & {
  readings: ReportReadingItem[]
}

export type MonthToDateReport = ReportSummaryData
