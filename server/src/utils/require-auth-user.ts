import type { Request } from 'express'
import type { AuthUserContext } from '@/types/express'
import { ApiError } from '@/utils/api-error'

/**
 * Returns the authenticated user from the JWT middleware.
 * Never use a user id from the request body for ownership checks.
 */
export function requireAuthUser(req: Request): AuthUserContext {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.')
  }

  return req.user
}
