import { Prisma } from '@prisma/client'
import {
  MAX_READINGS_PER_DAY,
  resolveTimeSlotLabel,
} from '@/constants/time-slots'
import { toDateOnlyUtc } from '@/lib/date-only'
import { prisma } from '@/lib/prisma'
import { toPublicReading } from '@/lib/public-reading'
import type { CreateReadingBody } from '@/validators/reading.validators'
import { ApiError } from '@/utils/api-error'

function duplicateSlotMessage(timeSlot: string): string {
  return `You already have an ${resolveTimeSlotLabel(timeSlot)} reading for this date.`
}

export async function listReadingsForUser(userId: string) {
  const readings = await prisma.reading.findMany({
    where: { userId },
    orderBy: [{ readingDate: 'desc' }, { timeSlot: 'asc' }],
  })

  return readings.map(toPublicReading)
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
    throw new ApiError(400, 'You can add only 4 readings per day.')
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
    throw new ApiError(409, duplicateSlotMessage(input.timeSlot))
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
      throw new ApiError(409, duplicateSlotMessage(input.timeSlot))
    }
    throw error
  }
}
