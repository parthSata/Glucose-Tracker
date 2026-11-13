import { resolveTimeSlotLabel } from '@/lib/time-slots'
import type { ReportReadingItem } from '@/types/report'

type DailyReadingItemProps = {
  reading: ReportReadingItem
}

export function DailyReadingItem({ reading }: DailyReadingItemProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-stone-200/80 bg-gradient-to-r from-white to-teal-50/40 px-4 py-3.5">
      <p className="min-w-0 truncate text-sm font-semibold text-stone-900">
        {resolveTimeSlotLabel(reading.timeSlot)}
      </p>
      <p className="shrink-0 text-lg font-semibold tabular-nums text-teal-900">
        {reading.value}
        <span className="ml-1 text-sm font-medium text-stone-500">mg/dl</span>
      </p>
    </li>
  )
}
