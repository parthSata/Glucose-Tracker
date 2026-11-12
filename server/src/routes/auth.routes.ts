import { Router } from 'express'
import { register } from '../controllers/auth.controller'
import { validateRequest } from '../middleware/validate.middleware'
import { asyncHandler } from '../utils/async-handler'
import { registerBodySchema } from '../validators/auth.validators'

const authRoutes = Router()

authRoutes.post(
  '/register',
  validateRequest(registerBodySchema),
  asyncHandler(register),
)

export { authRoutes }
