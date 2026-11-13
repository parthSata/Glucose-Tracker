import { StatCard } from '@/components/ui/stat-card'
import {
  formatAverageStat,
  formatGlucoseStat,
} from '@/lib/reading-stats'

type ReportSummaryProps = {
  rangeLabel: string
  highest: number | null
  lowest: number | null
  average: number | null
  count: number
}

export function ReportSummary({
  rangeLabel,
  highest,
  lowest,
  average,
  count,
}: ReportSummaryProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-stone-600">
        Date range:{' '}
        <span className="font-semibold text-stone-900">{rangeLabel}</span>
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Highest"
          value={formatGlucoseStat(highest)}
          hint="mg/dl"
        />
        <StatCard
          label="Lowest"
          value={formatGlucoseStat(lowest)}
          hint="mg/dl"
        />
        <StatCard
          label="Average"
          value={formatAverageStat(average)}
          hint="mg/dl"
        />
        <StatCard
          label="Total readings"
          value={String(count)}
        />
      </div>
    </div>
  )
}
