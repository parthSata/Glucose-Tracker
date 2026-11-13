import { DailyReadingItem } from '@/components/features/reports/daily-reading-item'
import { ReportEmptyState } from '@/components/features/reports/report-empty-state'
import type { ReportReadingItem } from '@/types/report'

type DailyReadingListProps = {
  readings: ReportReadingItem[]
}

export function DailyReadingList({ readings }: DailyReadingListProps) {
  if (readings.length === 0) {
    return <ReportEmptyState />
  }

  return (
    <ul className="space-y-3">
      {readings.map((reading) => (
        <DailyReadingItem key={reading.id} reading={reading} />
      ))}
    </ul>
  )
}
