import type { Reading } from '@/types/reading'
import { resolveTimeSlotLabel } from '@/lib/time-slots'

type ReadingListItemProps = {
  reading: Reading
  onView: (readingId: string) => void
}

export function ReadingListItem({ reading, onView }: ReadingListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onView(reading.id)}
        className="grid w-full gap-3 rounded-xl border border-stone-200/80 bg-gradient-to-r from-white to-teal-50/40 px-4 py-3.5 text-left transition hover:border-teal-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:grid-cols-[1fr_auto_auto] sm:items-center"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">
            {resolveTimeSlotLabel(reading.timeSlot)}
          </p>
          <p className="mt-0.5 text-sm text-stone-600">{reading.readingDate}</p>
        </div>
        <p className="text-lg font-semibold tabular-nums text-teal-900">
          {reading.value}
          <span className="ml-1 text-sm font-medium text-stone-500">mg/dl</span>
        </p>
        <span className="text-sm font-semibold text-teal-800 sm:pl-2">
          View
        </span>
      </button>
    </li>
  )
}
