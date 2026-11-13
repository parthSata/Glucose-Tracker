import { toDateOnlyUtc } from '@/lib/date-only'
import { prisma } from '@/lib/prisma'
import { monthToDateRange } from '@/lib/report-ranges'
import {
  computeReadingStats,
  sortReadingsBySlot,
  toReportReadingItem,
} from '@/lib/reading-stats'

async function getReadingsInRange(
  userId: string,
  startDateOnly: string,
  endDateOnly: string,
) {
  return prisma.reading.findMany({
    where: {
      userId,
      readingDate: {
        gte: toDateOnlyUtc(startDateOnly),
        lte: toDateOnlyUtc(endDateOnly),
      },
    },
    orderBy: [{ readingDate: 'asc' }, { timeSlot: 'asc' }],
  })
}

export async function getDailyReportForUser(userId: string, dateOnly: string) {
  const readings = await getReadingsInRange(userId, dateOnly, dateOnly)
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

export async function getMonthToDateReportForUser(
  userId: string,
  dateOnly: string,
) {
  const range = monthToDateRange(dateOnly)
  const readings = await getReadingsInRange(userId, range.start, range.end)
  const stats = computeReadingStats(readings.map((reading) => reading.value))

  return {
    range,
    highest: stats.highest,
    lowest: stats.lowest,
    average: stats.average,
    count: stats.count,
  }
}
