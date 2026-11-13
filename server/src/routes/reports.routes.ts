import { Router } from 'express'
import {
  getDailyReport,
  getMonthToDateReport,
} from '@/controllers/report.controller'
import { authMiddleware } from '@/middleware/auth.middleware'
import { validateRequest } from '@/middleware/validate.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { reportDateQuerySchema } from '@/validators/report.validators'

const reportsRoutes = Router()

reportsRoutes.use(authMiddleware)

reportsRoutes.get(
  '/daily',
  validateRequest(reportDateQuerySchema, 'query'),
  asyncHandler(getDailyReport),
)

reportsRoutes.get(
  '/month-to-date',
  validateRequest(reportDateQuerySchema, 'query'),
  asyncHandler(getMonthToDateReport),
)

export { reportsRoutes }