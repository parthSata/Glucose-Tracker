import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { Spinner } from '@/components/ui/spinner'
import { ReadingListItem } from '@/components/features/readings/reading-list-item'
import { ReadingSortToggle } from '@/components/features/readings/reading-sort-toggle'
import type { ReadingDateSort } from '@/lib/sort-readings'
import type { Reading } from '@/types/reading'

type ReadingListProps = {
  readings: Reading[]
  isLoading: boolean
  error: string | null
  sort: ReadingDateSort
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onSortChange: (sort: ReadingDateSort) => void
  onPageChange: (page: number) => void
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
  page,
  totalPages,
  totalItems,
  pageSize,
  onSortChange,
  onPageChange,
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

  if (totalItems === 0) {
    return (
      <EmptyState
        title="No glucose readings found"
        description="You have not logged any readings yet. Add one with the form to see it listed here."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200/70 bg-white/70 px-3 py-2.5">
        <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
          Order by date
        </p>
        <ReadingSortToggle value={sort} onChange={onSortChange} />
      </div>

      <ul className="space-y-3">
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

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  )
}
