import { toDateOnlyUtc } from '@/lib/date-only'
import { prisma } from '@/lib/prisma'
import {
  computeReadingStats,
  sortReadingsBySlot,
  toReportReadingItem,
} from '@/lib/reading-stats'

export async function getDailyReportForUser(userId: string, dateOnly: string) {
  const readingDate = toDateOnlyUtc(dateOnly)

  const readings = await prisma.reading.findMany({
    where: {
      userId,
      readingDate,
    },
  })

  const ordered = sortReadingsBySlot(readings)
  const stats = computeReadingStats(ordered.map((reading) => reading.value))

  return {
    range: {
      start: dateOnly,
      end: dateOnly,
    },
    highest: stats.highest,
    lowest: stats.lowest,
    average: stats.average,
    count: stats.count,
    readings: ordered.map(toReportReadingItem),
  }
}
