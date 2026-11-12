import type { Reading } from '@/types/reading'
import { TIME_SLOTS, type TimeSlotValue } from '@/lib/time-slots'

export type ReadingDateSort = 'newest' | 'oldest'

const SLOT_ORDER = Object.fromEntries(
  TIME_SLOTS.map((slot, index) => [slot, index]),
) as Record<TimeSlotValue, number>

/** Sort by calendar date; same-day readings keep slot order (morning → dinner). */
export function sortReadingsByDate(
  readings: Reading[],
  sort: ReadingDateSort,
): Reading[] {
  return [...readings].sort((a, b) => {
    if (a.readingDate !== b.readingDate) {
      return sort === 'newest'
        ? b.readingDate.localeCompare(a.readingDate)
        : a.readingDate.localeCompare(b.readingDate)
    }

    return SLOT_ORDER[a.timeSlot] - SLOT_ORDER[b.timeSlot]
  })
}

export const READING_DATE_SORT_OPTIONS: Array<{
  value: ReadingDateSort
  label: string
}> = [
  { value: 'newest', label: 'Newest date first' },
  { value: 'oldest', label: 'Oldest date first' },
]

export const DEFAULT_READING_DATE_SORT: ReadingDateSort = 'newest'
