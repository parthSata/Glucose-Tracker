import { ReportEmptyState } from '@/components/features/reports/report-empty-state'
import { formatDisplayDateShort } from '@/lib/format-display-date'
import { resolveTimeSlotLabel } from '@/lib/time-slots'
import type { ReportReadingItem } from '@/types/report'

type DailyReadingTableProps = {
  readings: ReportReadingItem[]
}

export function DailyReadingTable({ readings }: DailyReadingTableProps) {
  if (readings.length === 0) {
    return <ReportEmptyState />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200/80">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">Daily glucose readings</caption>
        <thead className="bg-stone-50 text-xs font-semibold tracking-wide text-stone-500 uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Time slot
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Value
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 bg-white">
          {readings.map((reading) => (
            <tr key={reading.id} className="align-middle">
              <td className="px-4 py-3.5 font-medium text-stone-900">
                {resolveTimeSlotLabel(reading.timeSlot)}
              </td>
              <td className="px-4 py-3.5 tabular-nums text-teal-900">
                <span className="text-base font-semibold">{reading.value}</span>
                <span className="ml-1 text-xs font-medium text-stone-500">
                  mg/dl
                </span>
              </td>
              <td className="px-4 py-3.5 text-stone-600">
                {formatDisplayDateShort(reading.readingDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
