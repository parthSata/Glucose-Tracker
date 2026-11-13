import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { resolveTimeSlotLabel } from '@/lib/time-slots'
import type { Reading } from '@/types/reading'

type ReadingDeleteDialogProps = {
  open: boolean
  reading: Reading | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ReadingDeleteDialog({
  open,
  reading,
  isDeleting,
  onCancel,
  onConfirm,
}: ReadingDeleteDialogProps) {
  return (
    <Modal open={open} title="Delete reading?" onClose={onCancel}>
      <p className="text-sm leading-relaxed text-stone-600">
        This will permanently remove
        {reading ? (
          <>
            {' '}
            your{' '}
            <span className="font-medium text-stone-800">
              {resolveTimeSlotLabel(reading.timeSlot)}
            </span>{' '}
            reading from{' '}
            <span className="font-medium text-stone-800">
              {reading.readingDate}
            </span>{' '}
            ({reading.value} mg/dl)
          </>
        ) : (
          ' this reading'
        )}
        . This action cannot be undone.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          disabled={isDeleting}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={isDeleting}
          onClick={onConfirm}
        >
          {isDeleting ? 'Deleting…' : 'Delete reading'}
        </Button>
      </div>
    </Modal>
  )
}
