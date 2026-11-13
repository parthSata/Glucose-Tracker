import { EyeIcon } from '@/components/ui/eye-icon'
import { IconButton } from '@/components/ui/icon-button'
import { PencilIcon } from '@/components/ui/pencil-icon'
import { TrashIcon } from '@/components/ui/trash-icon'
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

        <div className="flex items-center gap-2">
          <IconButton label="View reading" onClick={() => onView(reading.id)}>
            <EyeIcon />
          </IconButton>
          <IconButton
            label="Edit reading"
            variant="primary"
            onClick={() => onEdit(reading)}
          >
            <PencilIcon />
          </IconButton>
          <IconButton
            label="Delete reading"
            variant="danger"
            onClick={() => onDelete(reading)}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    </li>
  )
}
