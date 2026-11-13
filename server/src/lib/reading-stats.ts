import type { Reading, TimeSlot } from '@prisma/client'
import { TIME_SLOTS, type TimeSlotValue } from '@/constants/time-slots'
import { formatDateOnlyUtc } from '@/lib/date-only'

export type ReadingStats = {
  /** Total = number of readings. */
  count: number
  /** Highest = maximum reading, or null when empty (never divide / invent). */
  highest: number | null
  /** Lowest = minimum reading, or null when empty. */
  lowest: number | null
  /** Average = sum ÷ count, rounded to 1 decimal; null when count is 0. */
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

/** Round to one decimal place without floating-point surprises. */
export function roundAverageToOneDecimal(sum: number, count: number): number {
  return Number((sum / count).toFixed(1))
}

/**
 * Report statistics for a set of glucose values.
 * Empty input → count 0 and null stats (does not divide by zero).
 */
export function computeReadingStats(values: number[]): ReadingStats {
  if (values.length === 0) {
    return {
      count: 0,
      highest: null,
      lowest: null,
      average: null,
    }
  }

  const count = values.length
  const sum = values.reduce((total, value) => total + value, 0)

  return {
    count,
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: roundAverageToOneDecimal(sum, count),
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
