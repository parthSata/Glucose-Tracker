import { Modal } from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import { formatDateTime } from '@/lib/format-datetime'
import { resolveTimeSlotLabel } from '@/lib/time-slots'
import type { Reading } from '@/types/reading'

type ReadingDetailModalProps = {
  open: boolean
  reading: Reading | null
  isLoading: boolean
  error: string | null
  onClose: () => void
  onRetry: () => void
}

export function ReadingDetailModal({
  open,
  reading,
  isLoading,
  error,
  onClose,
  onRetry,
}: ReadingDetailModalProps) {
  return (
    <Modal open={open} title="Reading details" onClose={onClose}>
      {isLoading ? (
        <Spinner label="Loading reading" />
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-center">
          <p className="text-sm text-red-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-semibold text-teal-800 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : null}

      {!isLoading && !error && reading ? (
        <dl className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-3">
            <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Date
            </dt>
            <dd className="mt-1 text-base font-medium text-stone-900">
              {reading.readingDate}
            </dd>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/80 px-4 py-3">
            <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Time slot
            </dt>
            <dd className="mt-1 text-base font-medium text-stone-900">
              {resolveTimeSlotLabel(reading.timeSlot)}
            </dd>
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50/70 px-4 py-3">
            <dt className="text-xs font-semibold tracking-wide text-teal-800 uppercase">
              Glucose value
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-teal-950">
              {reading.value}
              <span className="ml-2 text-sm font-medium text-teal-800">
                mg/dl
              </span>
            </dd>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
                Created
              </dt>
              <dd className="mt-1 text-sm text-stone-700">
                {formatDateTime(reading.createdAt)}
              </dd>
            </div>
            <div className="rounded-xl border border-stone-200 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
                Updated
              </dt>
              <dd className="mt-1 text-sm text-stone-700">
                {formatDateTime(reading.updatedAt)}
              </dd>
            </div>
          </div>
        </dl>
      ) : null}
    </Modal>
  )
}
