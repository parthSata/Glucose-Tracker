import { Router } from 'express'
import {
  createReading,
  getReading,
  listReadings,
} from '@/controllers/reading.controller'
import { authMiddleware } from '@/middleware/auth.middleware'
import { validateRequest } from '@/middleware/validate.middleware'
import { asyncHandler } from '@/utils/async-handler'
import {
  createReadingBodySchema,
  readingIdParamsSchema,
} from '@/validators/reading.validators'

const readingsRoutes = Router()

readingsRoutes.use(authMiddleware)

readingsRoutes.get('/', asyncHandler(listReadings))

readingsRoutes.get(
  '/:id',
  validateRequest(readingIdParamsSchema, 'params'),
  asyncHandler(getReading),
)

readingsRoutes.post(
  '/',
  validateRequest(createReadingBodySchema),
  asyncHandler(createReading),
)

export { readingsRoutes }
