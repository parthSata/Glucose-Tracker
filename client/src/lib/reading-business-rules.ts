import { MAX_READINGS_PER_DAY, resolveTimeSlotLabel } from '@/lib/time-slots'
import type { ReadingFormValues } from '@/lib/reading-schemas'
import type { Reading } from '@/types/reading'

export const MAX_READINGS_PER_DAY_MESSAGE =
  'You can add only 4 readings per day.'

export type ReadingFieldErrors = Partial<
  Record<keyof ReadingFormValues, string>
>

export function duplicateSlotMessage(timeSlot: string): string {
  return `You already have an ${resolveTimeSlotLabel(timeSlot)} reading for this date.`
}

export function mapReadingFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): ReadingFieldErrors {
  const mapped: ReadingFieldErrors = {}
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) {
      mapped[key as keyof ReadingFormValues] = messages[0]
    }
  }
  return mapped
}

type BusinessRuleOptions = {
  readings: Reading[]
  /** When editing, ignore this reading so same-slot same-date stays valid. */
  excludeReadingId?: string
}

/**
 * Client-side duplicate-slot + max-4 checks (assignment §5).
 * Backend still re-validates; this improves UX before the request.
 */
export function validateReadingBusinessRules(
  values: Pick<ReadingFormValues, 'readingDate' | 'timeSlot'>,
  options: BusinessRuleOptions,
): ReadingFieldErrors {
  const { readings, excludeReadingId } = options

  if (!values.readingDate || !values.timeSlot) {
    return {}
  }

  const sameDay = readings.filter(
    (reading) =>
      reading.readingDate === values.readingDate &&
      reading.id !== excludeReadingId,
  )

  if (sameDay.length >= MAX_READINGS_PER_DAY) {
    return { readingDate: MAX_READINGS_PER_DAY_MESSAGE }
  }

  const slotTaken = sameDay.some(
    (reading) => reading.timeSlot === values.timeSlot,
  )

  if (slotTaken) {
    return { timeSlot: duplicateSlotMessage(values.timeSlot) }
  }

  return {}
}

/** Map known assignment business messages onto form fields. */
export function mapReadingBusinessApiError(
  message: string,
): ReadingFieldErrors {
  if (message.startsWith('You already have an ')) {
    return { timeSlot: message }
  }

  if (message === MAX_READINGS_PER_DAY_MESSAGE) {
    return { readingDate: message }
  }

  return {}
}
