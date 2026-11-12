import type { Reading, TimeSlot } from '@prisma/client'
import { formatDateOnlyUtc } from '@/lib/date-only'

export type PublicReading = {
  id: string
  readingDate: string
  timeSlot: TimeSlot
  value: number
  createdAt: string
  updatedAt: string
}

export function toPublicReading(reading: Reading): PublicReading {
  return {
    id: reading.id,
    readingDate: formatDateOnlyUtc(reading.readingDate),
    timeSlot: reading.timeSlot,
    value: reading.value,
    createdAt: reading.createdAt.toISOString(),
    updatedAt: reading.updatedAt.toISOString(),
  }
}
