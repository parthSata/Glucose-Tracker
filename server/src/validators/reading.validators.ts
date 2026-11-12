import { z } from 'zod'
import { TIME_SLOTS } from '@/constants/time-slots'
import {
  isDateOnlyString,
  todayDateOnlyLocal,
} from '@/lib/date-only'

const VALUE_RANGE_MESSAGE = 'Value must be between 40 and 600 mg/dl.'
const VALUE_REQUIRED_MESSAGE = 'Please enter a glucose value.'
const DATE_FUTURE_MESSAGE = 'Date cannot be in the future.'

const timeSlotSchema = z.enum(TIME_SLOTS, {
  error: 'Please select a time slot.',
})

const readingDateSchema = z
  .string({ error: 'Please select a date.' })
  .trim()
  .min(1, 'Please select a date.')
  .refine(isDateOnlyString, 'Please select a valid date.')
  .refine(
    (value) => value <= todayDateOnlyLocal(),
    DATE_FUTURE_MESSAGE,
  )

/**
 * Accepts number or numeric string from JSON / forms.
 * Empty → required message; non-int / out of range → range message.
 */
const glucoseValueSchema = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value, ctx) => {
    if (value === null || value === undefined) {
      ctx.addIssue({ code: 'custom', message: VALUE_REQUIRED_MESSAGE })
      return z.NEVER
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed === '') {
        ctx.addIssue({ code: 'custom', message: VALUE_REQUIRED_MESSAGE })
        return z.NEVER
      }

      if (!/^\d+$/.test(trimmed)) {
        ctx.addIssue({ code: 'custom', message: VALUE_RANGE_MESSAGE })
        return z.NEVER
      }

      const parsed = Number(trimmed)
      if (parsed < 40 || parsed > 600) {
        ctx.addIssue({ code: 'custom', message: VALUE_RANGE_MESSAGE })
        return z.NEVER
      }

      return parsed
    }

    if (!Number.isInteger(value) || value < 40 || value > 600) {
      ctx.addIssue({ code: 'custom', message: VALUE_RANGE_MESSAGE })
      return z.NEVER
    }

    return value
  })

export const createReadingBodySchema = z.object({
  readingDate: readingDateSchema,
  timeSlot: timeSlotSchema,
  value: glucoseValueSchema,
})

export type CreateReadingBody = z.infer<typeof createReadingBodySchema>
