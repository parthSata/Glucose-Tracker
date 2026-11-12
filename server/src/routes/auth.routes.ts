import { Router } from 'express'
import { login, me, register } from '@/controllers/auth.controller'
import { authMiddleware } from '@/middleware/auth.middleware'
import { validateRequest } from '@/middleware/validate.middleware'
import { asyncHandler } from '@/utils/async-handler'
import {
  loginBodySchema,
  registerBodySchema,
} from '@/validators/auth.validators'

const authRoutes = Router()

authRoutes.post(
  '/register',
  validateRequest(registerBodySchema),
  asyncHandler(register),
)

authRoutes.post(
  '/login',
  validateRequest(loginBodySchema),
  asyncHandler(login),
)

authRoutes.get('/me', authMiddleware, asyncHandler(me))

export { authRoutes }
