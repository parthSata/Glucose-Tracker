import { z } from 'zod'
import { isDateOnlyString, todayDateOnlyLocal } from '@/lib/date-only'
import { TIME_SLOTS } from '@/lib/time-slots'

const VALUE_RANGE_MESSAGE = 'Value must be between 40 and 600 mg/dl.'
const VALUE_REQUIRED_MESSAGE = 'Please enter a glucose value.'
const DATE_FUTURE_MESSAGE = 'Date cannot be in the future.'

export const createReadingFormSchema = z.object({
  readingDate: z
    .string({ error: 'Please select a date.' })
    .trim()
    .min(1, 'Please select a date.')
    .refine(isDateOnlyString, 'Please select a valid date.')
    .refine(
      (value) => value <= todayDateOnlyLocal(),
      DATE_FUTURE_MESSAGE,
    ),
  timeSlot: z.enum(TIME_SLOTS, {
    error: 'Please select a time slot.',
  }),
  value: z
    .string({ error: VALUE_REQUIRED_MESSAGE })
    .trim()
    .superRefine((raw, ctx) => {
      if (raw === '') {
        ctx.addIssue({ code: 'custom', message: VALUE_REQUIRED_MESSAGE })
        return
      }

      if (!/^\d+$/.test(raw)) {
        ctx.addIssue({ code: 'custom', message: VALUE_RANGE_MESSAGE })
        return
      }

      const parsed = Number(raw)
      if (parsed < 40 || parsed > 600) {
        ctx.addIssue({ code: 'custom', message: VALUE_RANGE_MESSAGE })
      }
    }),
})

/** Form state allows empty slot before the user selects one. */
export type CreateReadingFormValues = {
  readingDate: string
  timeSlot: (typeof TIME_SLOTS)[number] | ''
  value: string
}

export type CreateReadingPayload = {
  readingDate: string
  timeSlot: (typeof TIME_SLOTS)[number]
  value: number
}

export function toCreateReadingPayload(
  values: z.infer<typeof createReadingFormSchema>,
): CreateReadingPayload {
  return {
    readingDate: values.readingDate,
    timeSlot: values.timeSlot,
    value: Number(values.value),
  }
}
