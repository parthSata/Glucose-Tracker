import type { Request, Response } from 'express'
import { registerUser } from '../services/auth.service'
import type { RegisterBody } from '../validators/auth.validators'
import { ApiResponse } from '../utils/api-response'

export async function register(req: Request, res: Response): Promise<void> {
  const body = req.body as RegisterBody
  const data = await registerUser(body)

  res
    .status(201)
    .json(new ApiResponse(201, data, 'Account created successfully.'))
}
