import type { Reading } from '@/types/reading'
import { resolveTimeSlotLabel } from '@/lib/time-slots'

type ReadingListItemProps = {
  reading: Reading
}

export function ReadingListItem({ reading }: ReadingListItemProps) {
  return (
    <li className="grid gap-3 rounded-xl border border-stone-200/80 bg-gradient-to-r from-white to-teal-50/40 px-4 py-3.5 sm:grid-cols-[1fr_auto] sm:items-center">
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
    </li>
  )
}
