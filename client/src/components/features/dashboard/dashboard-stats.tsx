import { StatCard } from '@/components/ui/stat-card'
import { formatGlucoseStat, type ReadingStats } from '@/lib/reading-stats'

type DashboardStatsProps = {
  completionCount: number
  completionMax: number
  todayStats: ReadingStats
  totalReadings: number
}

export function DashboardStats({
  completionCount,
  completionMax,
  todayStats,
  totalReadings,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Today’s completion"
        value={`${completionCount} of ${completionMax}`}
        hint="Readings logged today"
      />
      <StatCard
        label="Highest today"
        value={formatGlucoseStat(todayStats.highest)}
        hint="mg/dl"
      />
      <StatCard
        label="Lowest today"
        value={formatGlucoseStat(todayStats.lowest)}
        hint="mg/dl"
      />
      <StatCard
        label="Average today"
        value={formatGlucoseStat(todayStats.average)}
        hint="mg/dl"
      />
      <StatCard
        label="Total readings"
        value={String(totalReadings)}
        hint="All time"
      />
    </div>
  )
}
