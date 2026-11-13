import { toDateOnlyUtc } from '@/lib/date-only'
import { prisma } from '@/lib/prisma'
import { monthToDateRange, previousMonthRange } from '@/lib/report-ranges'
import {
  computeReadingStats,
  sortReadingsBySlot,
  toReportReadingItem,
  type ReportReadingItem,
} from '@/lib/reading-stats'

type ReportSummaryPayload = {
  range: { start: string; end: string }
  highest: number | null
  lowest: number | null
  average: number | null
  count: number
}

/**
 * Inclusive calendar-date query, always scoped to the authenticated user.
 * Boundaries use date-only UTC midnight so days are not shifted by TZ.
 */
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

function toSummaryPayload(
  range: { start: string; end: string },
  values: number[],
): ReportSummaryPayload {
  const stats = computeReadingStats(values)

  return {
    range,
    highest: stats.highest,
    lowest: stats.lowest,
    average: stats.average,
    count: stats.count,
  }
}

export async function getDailyReportForUser(userId: string, dateOnly: string) {
  const readings = await getReadingsInRange(userId, dateOnly, dateOnly)
  const ordered = sortReadingsBySlot(readings)
  const summary = toSummaryPayload(
    { start: dateOnly, end: dateOnly },
    ordered.map((reading) => reading.value),
  )
  const reportReadings: ReportReadingItem[] = ordered.map(toReportReadingItem)

  return {
    ...summary,
    readings: reportReadings,
  }
}

export async function getMonthToDateReportForUser(
  userId: string,
  dateOnly: string,
) {
  const range = monthToDateRange(dateOnly)
  const readings = await getReadingsInRange(userId, range.start, range.end)

  return toSummaryPayload(
    range,
    readings.map((reading) => reading.value),
  )
}

export async function getMonthlyReportForUser(
  userId: string,
  dateOnly: string,
) {
  const range = previousMonthRange(dateOnly)
  const readings = await getReadingsInRange(userId, range.start, range.end)

  return toSummaryPayload(
    range,
    readings.map((reading) => reading.value),
  )
}
