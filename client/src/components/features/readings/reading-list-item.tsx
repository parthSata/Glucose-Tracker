import { EyeIcon } from '@/components/ui/eye-icon'
import { IconButton } from '@/components/ui/icon-button'
import { PencilIcon } from '@/components/ui/pencil-icon'
import { TrashIcon } from '@/components/ui/trash-icon'
import { formatDisplayDateShort } from '@/lib/format-display-date'
import { SLOT_ACCENT } from '@/lib/slot-accent'
import { resolveTimeSlotLabel } from '@/lib/time-slots'
import type { Reading } from '@/types/reading'

type ReadingListItemProps = {
  reading: Reading
  onView: (readingId: string) => void
  onEdit: (reading: Reading) => void
  onDelete: (reading: Reading) => void
}

export function ReadingListItem({
  reading,
  onView,
  onEdit,
  onDelete,
}: ReadingListItemProps) {
  const accent = SLOT_ACCENT[reading.timeSlot]

  return (
    <li
      className={`group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-gradient-to-r ${accent.soft} shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300/70 hover:shadow-md`}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1.5 ${accent.bar}`}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3 py-3.5 pr-3 pl-4 sm:gap-4 sm:pr-4 sm:pl-5">
        <button
          type="button"
          onClick={() => onView(reading.id)}
          className="min-w-0 flex-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <p className="truncate text-sm font-semibold text-stone-900 sm:text-[15px]">
            {resolveTimeSlotLabel(reading.timeSlot)}
          </p>
          <p className="mt-1 text-xs font-medium text-stone-500">
            {formatDisplayDateShort(reading.readingDate)}
          </p>
        </button>

        <div
          className={`shrink-0 rounded-xl px-3 py-2 text-center shadow-sm ${accent.chip}`}
        >
          <p className="text-lg leading-none font-bold tabular-nums">
            {reading.value}
          </p>
          <p className="mt-1 text-[10px] font-semibold tracking-wide uppercase opacity-90">
            mg/dl
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:items-center">
          <IconButton
            label="View reading"
            className="!h-9 !w-9 border-stone-200/80 bg-white/90"
            onClick={() => onView(reading.id)}
          >
            <EyeIcon />
          </IconButton>
          <IconButton
            label="Edit reading"
            variant="primary"
            className="!h-9 !w-9"
            onClick={() => onEdit(reading)}
          >
            <PencilIcon />
          </IconButton>
          <IconButton
            label="Delete reading"
            variant="danger"
            className="!h-9 !w-9"
            onClick={() => onDelete(reading)}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    </li>
  )
}
