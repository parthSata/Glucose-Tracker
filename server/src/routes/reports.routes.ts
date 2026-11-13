import { Router } from 'express'
import {
  getDailyReport,
  getMonthToDateReport,
  getMonthlyReport,
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

reportsRoutes.get(
  '/monthly',
  validateRequest(reportDateQuerySchema, 'query'),
  asyncHandler(getMonthlyReport),
)

export { reportsRoutes }