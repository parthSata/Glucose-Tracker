import { z } from 'zod'
import { isDateOnlyString, todayDateOnlyLocal } from '@/lib/date-only'

export const DATE_REQUIRED_MESSAGE = 'Please select a date.'
export const DATE_INVALID_MESSAGE = 'Please select a valid date.'
export const DATE_FUTURE_MESSAGE = 'Date cannot be in the future.'

/** Shared YYYY-MM-DD calendar date — not in the future (readings + reports). */
export const dateOnlyNotFutureSchema = z
  .string({ error: DATE_REQUIRED_MESSAGE })
  .trim()
  .min(1, DATE_REQUIRED_MESSAGE)
  .refine(isDateOnlyString, DATE_INVALID_MESSAGE)
  .refine(
    (value) => value <= todayDateOnlyLocal(),
    DATE_FUTURE_MESSAGE,
  )

export const reportDateFormSchema = z.object({
  date: dateOnlyNotFutureSchema,
})

export type ReportDateFormValues = z.infer<typeof reportDateFormSchema>
