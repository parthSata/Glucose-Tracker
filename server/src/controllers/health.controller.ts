import type { Request, Response } from 'express'
import { ApiResponse } from '../utils/api-response'

export function getHealth(_req: Request, res: Response): void {
  res
    .status(200)
    .json(new ApiResponse(200, { status: 'ok' }, 'Sweety API is running'))
}
