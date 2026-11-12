import type { NextFunction, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { env } from '@/config/env'
import { ApiError } from '@/utils/api-error'

const TIME_SLOT_LABELS: Record<string, string> = {
  MORNING: 'Morning (fasting)',
  AFTER_BREAKFAST: 'After breakfast',
  AFTER_LUNCH: 'After lunch',
  AFTER_DINNER: 'After dinner',
}

function uniqueConstraintMessage(meta: unknown): string {
  if (
    meta &&
    typeof meta === 'object' &&
    'target' in meta &&
    Array.isArray((meta as { target: unknown }).target)
  ) {
    const target = (meta as { target: string[] }).target
    if (target.includes('email')) {
      return 'An account with this email already exists.'
    }
    if (
      target.includes('user_id') &&
      target.includes('reading_date') &&
      target.includes('time_slot')
    ) {
      return 'You already have a reading for this date and time slot.'
    }
  }
  return 'A record with this value already exists.'
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors !== undefined ? { errors: err.errors } : {}),
    })
    return
  }

  if (err instanceof ZodError) {
    const errors = err.flatten().fieldErrors
    const message =
      err.issues[0]?.message ?? 'Validation failed. Please check your input.'
    res.status(400).json({
      success: false,
      statusCode: 400,
      message,
      errors,
    })
    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const message = uniqueConstraintMessage(err.meta)
      res.status(409).json({
        success: false,
        statusCode: 409,
        message,
      })
      return
    }
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Something went wrong. Please try again later.',
  })
}

export function resolveTimeSlotLabel(slot: string): string {
  return TIME_SLOT_LABELS[slot] ?? slot
}
