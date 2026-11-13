import { ReadingForm } from '@/components/features/readings/reading-form'
import { Modal } from '@/components/ui/modal'
import { useEditReading } from '@/hooks/use-edit-reading'
import type { Reading } from '@/types/reading'

type ReadingEditModalProps = {
  open: boolean
  reading: Reading | null
  readings: Reading[]
  onClose: () => void
  onUpdated: (reading: Reading, message: string) => void
}

export function ReadingEditModal({
  open,
  reading,
  readings,
  onClose,
  onUpdated,
}: ReadingEditModalProps) {
  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    maxDate,
    onChange,
    setFieldValue,
    onSubmit,
  } = useEditReading({
    reading: open ? reading : null,
    readings,
    onSuccess: onUpdated,
  })

  return (
    <Modal open={open} title="Edit reading" onClose={onClose}>
      <p className="mb-4 text-sm text-stone-600">
        Update the date, time slot, or glucose value, then save your changes.
      </p>
      <ReadingForm
        values={values}
        fieldErrors={fieldErrors}
        formError={formError}
        isSubmitting={isSubmitting}
        maxDate={maxDate}
        submitLabel="Save changes"
        submittingLabel="Saving changes…"
        idPrefix="edit"
        onCancel={onClose}
        onChange={onChange}
        setFieldValue={setFieldValue}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}
