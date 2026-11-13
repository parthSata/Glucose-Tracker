import type { NextFunction, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { env } from '@/config/env'
import { resolveTimeSlotLabel } from '@/constants/time-slots'
import { ApiError } from '@/utils/api-error'

function isReadingUniqueTarget(target: string[]): boolean {
  return (
    (target.includes('user_id') || target.includes('userId')) &&
    (target.includes('reading_date') || target.includes('readingDate')) &&
    (target.includes('time_slot') || target.includes('timeSlot'))
  )
}

/**
 * Fallback for P2002 that escaped the service layer.
 * Prefer the service's slot-labeled message; use body.timeSlot when present.
 */
function uniqueConstraintMessage(meta: unknown, req: Request): string {
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
    if (isReadingUniqueTarget(target)) {
      const rawSlot = req.body?.timeSlot
      if (typeof rawSlot === 'string' && rawSlot.trim() !== '') {
        return `You already have an ${resolveTimeSlotLabel(rawSlot)} reading for this date.`
      }
      return 'You already have a reading for this date and time slot.'
    }
  }
  return 'A record with this value already exists.'
}

export function errorMiddleware(
  err: unknown,
  req: Request,
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
      const message = uniqueConstraintMessage(err.meta, req)
      const errors =
        typeof req.body?.timeSlot === 'string'
          ? { timeSlot: [message] }
          : undefined
      res.status(409).json({
        success: false,
        statusCode: 409,
        message,
        ...(errors ? { errors } : {}),
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
