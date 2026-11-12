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
import { requireAuthUser } from '@/utils/require-auth-user'
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
  const authUser = requireAuthUser(req)
  const user = await getCurrentUser(authUser.id)

  res.status(200).json(new ApiResponse(200, { user }, 'Success'))
}

export async function logout(req: Request, res: Response): Promise<void> {
  // Stateless JWT: auth middleware already verified the session.
  // Client must discard the token; server confirms logout for the UX/API contract.
  requireAuthUser(req)

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out successfully.'))
}
