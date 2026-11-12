import type { Request, Response } from 'express'
import {
  createReadingForUser,
  listReadingsForUser,
} from '@/services/reading.service'
import type { CreateReadingBody } from '@/validators/reading.validators'
import { requireAuthUser } from '@/utils/require-auth-user'
import { ApiResponse } from '@/utils/api-response'

export async function listReadings(req: Request, res: Response): Promise<void> {
  const authUser = requireAuthUser(req)
  const readings = await listReadingsForUser(authUser.id)

  res
    .status(200)
    .json(new ApiResponse(200, { readings }, 'Readings retrieved successfully.'))
}

export async function createReading(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = requireAuthUser(req)
  const body = req.body as CreateReadingBody
  const reading = await createReadingForUser(authUser.id, body)

  res
    .status(201)
    .json(new ApiResponse(201, { reading }, 'Reading saved successfully.'))
}
