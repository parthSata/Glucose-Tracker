import type { TimeSlotValue } from '@/lib/time-slots'

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

export type DailyReport = {
  range: ReportRange
  highest: number | null
  lowest: number | null
  average: number | null
  count: number
  readings: ReportReadingItem[]
}
