import { TIME_SLOTS, type TimeSlotValue } from '@/lib/time-slots'
import type { Reading } from '@/types/reading'

export type ReadingStats = {
  count: number
  highest: number | null
  lowest: number | null
  /** Rounded to 1 decimal, matching report rules. */
  average: number | null
}

const SLOT_ORDER = Object.fromEntries(
  TIME_SLOTS.map((slot, index) => [slot, index]),
) as Record<TimeSlotValue, number>

export function filterReadingsForDate(
  readings: Reading[],
  dateOnly: string,
): Reading[] {
  return readings.filter((reading) => reading.readingDate === dateOnly)
}

/** Sort today’s (or any same-day) list morning → dinner. */
export function sortReadingsBySlot(readings: Reading[]): Reading[] {
  return [...readings].sort(
    (a, b) => SLOT_ORDER[a.timeSlot] - SLOT_ORDER[b.timeSlot],
  )
}

export function computeReadingStats(readings: Reading[]): ReadingStats {
  if (readings.length === 0) {
    return {
      count: 0,
      highest: null,
      lowest: null,
      average: null,
    }
  }

  const values = readings.map((reading) => reading.value)
  const sum = values.reduce((total, value) => total + value, 0)

  return {
    count: readings.length,
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: Math.round((sum / values.length) * 10) / 10,
  }
}

export function formatGlucoseStat(value: number | null): string {
  if (value === null) {
    return '—'
  }
  return String(value)
}
