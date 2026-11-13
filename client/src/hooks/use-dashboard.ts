import { todayDateOnlyLocal } from '@/lib/date-only'
import { formatDisplayDate } from '@/lib/format-display-date'
import {
  computeReadingStats,
  filterReadingsForDate,
  sortReadingsBySlot,
} from '@/lib/reading-stats'
import { MAX_READINGS_PER_DAY } from '@/lib/time-slots'
import { useReadings } from '@/hooks/use-readings'
import { useAuthStore } from '@/store/auth-store'

export function useDashboard() {
  const user = useAuthStore((state) => state.user)
  const { readings, isLoading, error, refetch } = useReadings()

  const todayDate = todayDateOnlyLocal()
  const todayReadings = sortReadingsBySlot(
    filterReadingsForDate(readings, todayDate),
  )
  const todayStats = computeReadingStats(todayReadings)
  const totalReadings = readings.length

  return {
    userName: user?.name ?? 'there',
    todayDate,
    todayDateLabel: formatDisplayDate(todayDate),
    todayReadings,
    todayStats,
    completionCount: todayStats.count,
    completionMax: MAX_READINGS_PER_DAY,
    totalReadings,
    hasAnyReadings: totalReadings > 0,
    isLoading,
    error,
    refetch,
  }
}
