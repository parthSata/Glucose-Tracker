import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { env } from '../config/env'
import { prisma } from '../lib/prisma'
import type { RegisterBody } from '../validators/auth.validators'
import { ApiError } from '../utils/api-error'
import { signAccessToken } from '../utils/jwt'

function toPublicUser(user: {
  id: string
  name: string
  email: string
  createdAt: Date
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function registerUser(input: RegisterBody) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  })

  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.')
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS)

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    const token = signAccessToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    })

    return {
      user: toPublicUser(user),
      token,
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ApiError(409, 'An account with this email already exists.')
    }
    throw error
  }
}
