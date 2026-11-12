/**
 * Canonical reading time slots (assignment §4.2).
 * Must stay in sync with Prisma `TimeSlot` and client `time-slots`.
 */
export const TIME_SLOTS = [
  'MORNING',
  'AFTER_BREAKFAST',
  'AFTER_LUNCH',
  'AFTER_DINNER',
] as const

export type TimeSlotValue = (typeof TIME_SLOTS)[number]

/** Human labels used in UI and duplicate-slot error messages. */
export const TIME_SLOT_LABELS: Record<TimeSlotValue, string> = {
  MORNING: 'Morning (fasting)',
  AFTER_BREAKFAST: 'After breakfast',
  AFTER_LUNCH: 'After lunch',
  AFTER_DINNER: 'After dinner',
}

export const TIME_SLOT_OPTIONS = TIME_SLOTS.map((value) => ({
  value,
  label: TIME_SLOT_LABELS[value],
}))

/** One reading per slot ⇒ at most four readings per user per day. */
export const MAX_READINGS_PER_DAY = TIME_SLOTS.length

export function isTimeSlotValue(value: string): value is TimeSlotValue {
  return (TIME_SLOTS as readonly string[]).includes(value)
}

export function resolveTimeSlotLabel(slot: string): string {
  if (isTimeSlotValue(slot)) {
    return TIME_SLOT_LABELS[slot]
  }
  return slot
}
