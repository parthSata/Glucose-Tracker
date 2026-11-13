import { EmptyState } from '@/components/ui/empty-state'
import { Dropdown } from '@/components/ui/dropdown'
import { Spinner } from '@/components/ui/spinner'
import { ReadingListItem } from '@/components/features/readings/reading-list-item'
import {
  READING_DATE_SORT_OPTIONS,
  type ReadingDateSort,
} from '@/lib/sort-readings'
import type { Reading } from '@/types/reading'

type ReadingListProps = {
  readings: Reading[]
  isLoading: boolean
  error: string | null
  sort: ReadingDateSort
  onSortChange: (sort: ReadingDateSort) => void
  onViewReading: (readingId: string) => void
  onEditReading: (reading: Reading) => void
  onDeleteReading: (reading: Reading) => void
  onRetry: () => void
}

export function ReadingList({
  readings,
  isLoading,
  error,
  sort,
  onSortChange,
  onViewReading,
  onEditReading,
  onDeleteReading,
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
        title="No glucose readings found"
        description="You have not logged any readings yet. Add one with the form to see it listed here."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="reading-date-sort"
          className="text-sm font-medium text-stone-700"
        >
          Sort by date
        </label>
        <Dropdown
          id="reading-date-sort"
          value={sort}
          options={READING_DATE_SORT_OPTIONS}
          className="sm:max-w-56"
          onChange={(nextValue) => {
            onSortChange(nextValue as ReadingDateSort)
          }}
        />
      </div>

      <ul className="space-y-2">
        {readings.map((reading) => (
          <ReadingListItem
            key={reading.id}
            reading={reading}
            onView={onViewReading}
            onEdit={onEditReading}
            onDelete={onDeleteReading}
          />
        ))}
      </ul>
    </div>
  )
}
