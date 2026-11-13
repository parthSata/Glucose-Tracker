import { DashboardTodayItem } from '@/components/features/dashboard/dashboard-today-item'
import { EmptyState } from '@/components/ui/empty-state'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import type { Reading } from '@/types/reading'

type DashboardTodayListProps = {
  readings: Reading[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export function DashboardTodayList({
  readings,
  isLoading,
  error,
  onRetry,
}: DashboardTodayListProps) {
  if (isLoading) {
    return <Spinner label="Loading today’s readings…" />
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-6 text-center">
        <p className="text-sm font-medium text-red-800">{error}</p>
        <Button
          type="button"
          variant="secondary"
          className="mx-auto max-w-40"
          onClick={onRetry}
        >
          Try again
        </Button>
      </div>
    )
  }

  if (readings.length === 0) {
    return (
      <EmptyState
        title="No readings for today yet"
        description="Add your first reading for today to see it listed here."
      />
    )
  }

  return (
    <ul className="space-y-3">
      {readings.map((reading) => (
        <DashboardTodayItem key={reading.id} reading={reading} />
      ))}
    </ul>
  )
}
