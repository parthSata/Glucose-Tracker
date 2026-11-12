import type { Request, Response } from 'express'
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '@/services/auth.service'
import type {
  LoginBody,
  RegisterBody,
} from '@/validators/auth.validators'
import { ApiError } from '@/utils/api-error'
import { ApiResponse } from '@/utils/api-response'

export async function register(req: Request, res: Response): Promise<void> {
  const body = req.body as RegisterBody
  const data = await registerUser(body)

  res
    .status(201)
    .json(new ApiResponse(201, data, 'Account created successfully.'))
}

export async function login(req: Request, res: Response): Promise<void> {
  const body = req.body as LoginBody
  const data = await loginUser(body)

  res.status(200).json(new ApiResponse(200, data, 'Logged in successfully.'))
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.')
  }

  const user = await getCurrentUser(req.user.id)

  res.status(200).json(new ApiResponse(200, { user }, 'Success'))
}
