import { Router } from 'express'
import {
  createReading,
  listReadings,
} from '@/controllers/reading.controller'
import { authMiddleware } from '@/middleware/auth.middleware'
import { validateRequest } from '@/middleware/validate.middleware'
import { asyncHandler } from '@/utils/async-handler'
import { createReadingBodySchema } from '@/validators/reading.validators'

const readingsRoutes = Router()

readingsRoutes.use(authMiddleware)

readingsRoutes.get('/', asyncHandler(listReadings))

readingsRoutes.post(
  '/',
  validateRequest(createReadingBodySchema),
  asyncHandler(createReading),
)

export { readingsRoutes }
