import { DailyReadingItem } from '@/components/features/reports/daily-reading-item'
import { EmptyState } from '@/components/ui/empty-state'
import type { ReportReadingItem } from '@/types/report'

type DailyReadingListProps = {
  readings: ReportReadingItem[]
}

export function DailyReadingList({ readings }: DailyReadingListProps) {
  if (readings.length === 0) {
    return (
      <EmptyState
        title="No glucose readings found for this period."
        description="Start recording your readings to see your report."
      />
    )
  }

  return (
    <ul className="space-y-3">
      {readings.map((reading) => (
        <DailyReadingItem key={reading.id} reading={reading} />
      ))}
    </ul>
  )
}
