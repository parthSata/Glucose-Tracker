import type { Prisma } from '@prisma/client'

/** Prisma select that never includes passwordHash. */
export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect

export type PublicUserRecord = {
  id: string
  name: string
  email: string
  createdAt: Date
}

export function toPublicUser(user: PublicUserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}
