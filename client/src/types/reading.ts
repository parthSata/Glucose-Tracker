import type { TimeSlotValue } from '@/lib/time-slots'

export type Reading = {
  id: string
  readingDate: string
  timeSlot: TimeSlotValue
  value: number
  createdAt: string
  updatedAt: string
}
