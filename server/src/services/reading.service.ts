import { Prisma } from '@prisma/client'
import {
  MAX_READINGS_PER_DAY,
  resolveTimeSlotLabel,
} from '@/constants/time-slots'
import { toDateOnlyUtc } from '@/lib/date-only'
import { prisma } from '@/lib/prisma'
import { toPublicReading } from '@/lib/public-reading'
import type {
  CreateReadingBody,
  UpdateReadingBody,
} from '@/validators/reading.validators'
import { ApiError } from '@/utils/api-error'

const MAX_READINGS_PER_DAY_MESSAGE = 'You can add only 4 readings per day.'

function duplicateSlotMessage(timeSlot: string): string {
  return `You already have an ${resolveTimeSlotLabel(timeSlot)} reading for this date.`
}

function throwMaxReadingsPerDay(): never {
  throw new ApiError(400, MAX_READINGS_PER_DAY_MESSAGE, {
    readingDate: [MAX_READINGS_PER_DAY_MESSAGE],
  })
}

function throwDuplicateSlot(timeSlot: string): never {
  const message = duplicateSlotMessage(timeSlot)
  throw new ApiError(409, message, {
    timeSlot: [message],
  })
}

export async function listReadingsForUser(userId: string) {
  const readings = await prisma.reading.findMany({
    where: { userId },
    orderBy: [{ readingDate: 'desc' }, { timeSlot: 'asc' }],
  })

  return readings.map(toPublicReading)
}

export async function getReadingForUser(userId: string, readingId: string) {
  const reading = await prisma.reading.findFirst({
    where: {
      id: readingId,
      userId,
    },
  })

  if (!reading) {
    throw new ApiError(404, 'Reading not found.')
  }

  return toPublicReading(reading)
}

export async function createReadingForUser(
  userId: string,
  input: CreateReadingBody,
) {
  const readingDate = toDateOnlyUtc(input.readingDate)

  const countForDay = await prisma.reading.count({
    where: {
      userId,
      readingDate,
    },
  })

  if (countForDay >= MAX_READINGS_PER_DAY) {
    throwMaxReadingsPerDay()
  }

  const existingSlot = await prisma.reading.findFirst({
    where: {
      userId,
      readingDate,
      timeSlot: input.timeSlot,
    },
    select: { id: true },
  })

  if (existingSlot) {
    throwDuplicateSlot(input.timeSlot)
  }

  try {
    const reading = await prisma.reading.create({
      data: {
        userId,
        readingDate,
        timeSlot: input.timeSlot,
        value: input.value,
      },
    })

    return toPublicReading(reading)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throwDuplicateSlot(input.timeSlot)
    }
    throw error
  }
}

export async function updateReadingForUser(
  userId: string,
  readingId: string,
  input: UpdateReadingBody,
) {
  const existing = await prisma.reading.findFirst({
    where: {
      id: readingId,
      userId,
    },
    select: { id: true },
  })

  if (!existing) {
    throw new ApiError(404, 'Reading not found.')
  }

  const readingDate = toDateOnlyUtc(input.readingDate)

  const otherReadingsThatDay = await prisma.reading.count({
    where: {
      userId,
      readingDate,
      NOT: { id: readingId },
    },
  })

  if (otherReadingsThatDay >= MAX_READINGS_PER_DAY) {
    throwMaxReadingsPerDay()
  }

  const slotConflict = await prisma.reading.findFirst({
    where: {
      userId,
      readingDate,
      timeSlot: input.timeSlot,
      NOT: { id: readingId },
    },
    select: { id: true },
  })

  if (slotConflict) {
    throwDuplicateSlot(input.timeSlot)
  }

  try {
    const reading = await prisma.reading.update({
      where: { id: readingId },
      data: {
        readingDate,
        timeSlot: input.timeSlot,
        value: input.value,
      },
    })

    return toPublicReading(reading)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throwDuplicateSlot(input.timeSlot)
    }
    throw error
  }
}

export async function deleteReadingForUser(userId: string, readingId: string) {
  const existing = await prisma.reading.findFirst({
    where: {
      id: readingId,
      userId,
    },
    select: { id: true },
  })

  if (!existing) {
    throw new ApiError(404, 'Reading not found.')
  }

  await prisma.reading.delete({
    where: { id: readingId },
  })
}
