import { ApiError } from '@/utils/api-error'

/**
 * Ensures the authenticated user owns the resource.
 * Uses 404 (not 403) so existence of other users' records is not leaked.
 * Always compare against JWT `req.user.id`, never a body/query user id.
 */
export function assertResourceOwner(
  resourceUserId: string,
  authenticatedUserId: string,
): void {
  if (resourceUserId !== authenticatedUserId) {
    throw new ApiError(404, 'Resource not found.')
  }
}
