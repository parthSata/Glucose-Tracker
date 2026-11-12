import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { env } from '@/config/env'
import { prisma } from '@/lib/prisma'
import {
  publicUserSelect,
  toPublicUser,
} from '@/lib/public-user'
import type {
  LoginBody,
  RegisterBody,
} from '@/validators/auth.validators'
import { ApiError } from '@/utils/api-error'
import { signAccessToken } from '@/utils/jwt'

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.'

/** Precomputed bcrypt hash used when no user exists (keeps compare timing similar). */
const DUMMY_PASSWORD_HASH =
  '$2b$10$.36TMSiuEcUkCpmXcj2uqenhzAWx.WFoaqv0l8zPze3WDA90iBrKu'

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
      select: publicUserSelect,
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

export async function loginUser(input: LoginBody) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      ...publicUserSelect,
      passwordHash: true,
    },
  })

  const passwordMatches = await bcrypt.compare(
    input.password,
    user?.passwordHash ?? DUMMY_PASSWORD_HASH,
  )

  if (!user || !passwordMatches) {
    throw new ApiError(401, INVALID_CREDENTIALS_MESSAGE)
  }

  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  })

  // passwordHash is intentionally omitted from the returned public user.
  return {
    user: toPublicUser(user),
    token,
  }
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  })

  if (!user) {
    throw new ApiError(401, 'Authentication required.')
  }

  return toPublicUser(user)
}
