import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '@/utils/api-error'
import { verifyAccessToken } from '@/utils/jwt'

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    next(new ApiError(401, 'Authentication required.'))
    return
  }

  const token = header.slice('Bearer '.length).trim()

  if (!token) {
    next(new ApiError(401, 'Authentication required.'))
    return
  }

  try {
    const payload = verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    }
    next()
  } catch {
    next(new ApiError(401, 'Authentication required.'))
  }
}
