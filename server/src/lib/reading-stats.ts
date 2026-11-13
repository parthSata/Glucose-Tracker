import type { Reading, TimeSlot } from '@prisma/client'
import { TIME_SLOTS, type TimeSlotValue } from '@/constants/time-slots'
import { formatDateOnlyUtc } from '@/lib/date-only'

export type ReadingStats = {
  count: number
  highest: number | null
  lowest: number | null
  /** Rounded to 1 decimal, or null when empty. */
  average: number | null
}

export type ReportReadingItem = {
  id: string
  readingDate: string
  timeSlot: TimeSlot
  value: number
}

const SLOT_ORDER = Object.fromEntries(
  TIME_SLOTS.map((slot, index) => [slot, index]),
) as Record<TimeSlotValue, number>

export function computeReadingStats(
  values: number[],
): ReadingStats {
  if (values.length === 0) {
    return {
      count: 0,
      highest: null,
      lowest: null,
      average: null,
    }
  }

  const sum = values.reduce((total, value) => total + value, 0)

  return {
    count: values.length,
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: Math.round((sum / values.length) * 10) / 10,
  }
}

export function sortReadingsBySlot(readings: Reading[]): Reading[] {
  return [...readings].sort(
    (a, b) =>
      SLOT_ORDER[a.timeSlot as TimeSlotValue] -
      SLOT_ORDER[b.timeSlot as TimeSlotValue],
  )
}

export function toReportReadingItem(reading: Reading): ReportReadingItem {
  return {
    id: reading.id,
    readingDate: formatDateOnlyUtc(reading.readingDate),
    timeSlot: reading.timeSlot,
    value: reading.value,
  }
}
