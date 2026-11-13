import type { Reading } from '@/types/reading'
import { resolveTimeSlotLabel } from '@/lib/time-slots'

type ReadingListItemProps = {
  reading: Reading
  onView: (readingId: string) => void
  onEdit: (reading: Reading) => void
}

export function ReadingListItem({
  reading,
  onView,
  onEdit,
}: ReadingListItemProps) {
  return (
    <li className="rounded-xl border border-stone-200/80 bg-gradient-to-r from-white to-teal-50/40 px-4 py-3.5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <button
          type="button"
          onClick={() => onView(reading.id)}
          className="min-w-0 text-left transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <p className="truncate text-sm font-semibold text-stone-900">
            {resolveTimeSlotLabel(reading.timeSlot)}
          </p>
          <p className="mt-0.5 text-sm text-stone-600">{reading.readingDate}</p>
          <p className="mt-2 text-lg font-semibold tabular-nums text-teal-900 sm:mt-1">
            {reading.value}
            <span className="ml-1 text-sm font-medium text-stone-500">
              mg/dl
            </span>
          </p>
        </button>

        <div className="flex gap-2 sm:flex-col sm:items-stretch lg:flex-row">
          <button
            type="button"
            onClick={() => onView(reading.id)}
            className="min-h-10 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(reading)}
            className="min-h-10 flex-1 rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Edit
          </button>
        </div>
      </div>
    </li>
  )
}
