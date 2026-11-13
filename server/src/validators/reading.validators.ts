import { z } from 'zod'
import { TIME_SLOTS } from '@/constants/time-slots'
import { dateOnlyNotFutureSchema } from '@/validators/date.validators'

const VALUE_RANGE_MESSAGE = 'Value must be between 40 and 600 mg/dl.'
const VALUE_REQUIRED_MESSAGE = 'Please enter a glucose value.'

const timeSlotSchema = z.enum(TIME_SLOTS, {
  error: 'Please select a time slot.',
})

const readingDateSchema = dateOnlyNotFutureSchema

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

/** Same field rules as create — assignment validation messages stay identical. */
export const updateReadingBodySchema = createReadingBodySchema

export const readingIdParamsSchema = z.object({
  id: z
    .string({ error: 'Reading id is required.' })
    .trim()
    .uuid('Please provide a valid reading id.'),
})

export type CreateReadingBody = z.infer<typeof createReadingBodySchema>
export type UpdateReadingBody = z.infer<typeof updateReadingBodySchema>
export type ReadingIdParams = z.infer<typeof readingIdParamsSchema>
