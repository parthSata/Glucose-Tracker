import { EmptyState } from '@/components/ui/empty-state'
import { Spinner } from '@/components/ui/spinner'
import { ReadingListItem } from '@/components/features/readings/reading-list-item'
import type { Reading } from '@/types/reading'

type ReadingListProps = {
  readings: Reading[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export function ReadingList({
  readings,
  isLoading,
  error,
  onRetry,
}: ReadingListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Loading readings" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
        <p className="text-sm text-red-800">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-semibold text-teal-800 hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (readings.length === 0) {
    return (
      <EmptyState
        title="No readings yet"
        description="Add your first glucose reading using the form above."
      />
    )
  }

  return (
    <ul className="space-y-2">
      {readings.map((reading) => (
        <ReadingListItem key={reading.id} reading={reading} />
      ))}
    </ul>
  )
}
