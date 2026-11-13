import { z } from 'zod'
import { dateOnlyNotFutureSchema } from '@/validators/date.validators'

/** Query for all report endpoints: `?date=YYYY-MM-DD`. */
export const reportDateQuerySchema = z.object({
  date: dateOnlyNotFutureSchema,
})

export type ReportDateQuery = z.infer<typeof reportDateQuerySchema>
