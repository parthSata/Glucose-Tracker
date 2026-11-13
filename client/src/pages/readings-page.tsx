import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { ReadingDeleteDialog } from '@/components/features/readings/reading-delete-dialog'
import { ReadingDetailModal } from '@/components/features/readings/reading-detail-modal'
import { ReadingEditModal } from '@/components/features/readings/reading-edit-modal'
import { ReadingForm } from '@/components/features/readings/reading-form'
import { ReadingList } from '@/components/features/readings/reading-list'
import { useCreateReading } from '@/hooks/use-create-reading'
import { useDeleteReading } from '@/hooks/use-delete-reading'
import { useReadingDetail } from '@/hooks/use-reading-detail'
import { useReadings } from '@/hooks/use-readings'
import {
  DEFAULT_READING_DATE_SORT,
  sortReadingsByDate,
  type ReadingDateSort,
} from '@/lib/sort-readings'
import { showSuccessToast } from '@/lib/toast'
import type { Reading } from '@/types/reading'

export default function ReadingsPage() {
  const { readings, isLoading, error, refetch } = useReadings()
  const [dateSort, setDateSort] = useState<ReadingDateSort>(
    DEFAULT_READING_DATE_SORT,
  )
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(
    null,
  )
  const [editingReading, setEditingReading] = useState<Reading | null>(null)
  const [deletingReading, setDeletingReading] = useState<Reading | null>(null)

  const sortedReadings = sortReadingsByDate(readings, dateSort)

  const {
    reading: detailReading,
    isLoading: isDetailLoading,
    error: detailError,
    retry: retryDetail,
  } = useReadingDetail(selectedReadingId)

  const { isDeleting, deleteReading } = useDeleteReading({
    onSuccess: () => {
      setDeletingReading(null)
      setSelectedReadingId(null)
      setEditingReading(null)
      void refetch()
    },
  })

  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    maxDate,
    onChange,
    setFieldValue,
    onSubmit,
  } = useCreateReading({
    onSuccess: (_reading, message) => {
      showSuccessToast(message)
      void refetch()
    },
  })

  function openEdit(reading: Reading) {
    setSelectedReadingId(null)
    setDeletingReading(null)
    setEditingReading(reading)
  }

  function openDelete(reading: Reading) {
    setSelectedReadingId(null)
    setEditingReading(null)
    setDeletingReading(reading)
  }

  return (
    <AppShell
      title="Readings"
      subtitle="Log up to four glucose readings per day. Values use mg/dl."
    >
      <div className="grid items-start gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:col-span-5 lg:p-8">
          <h2 className="text-xl font-semibold text-stone-900">Add reading</h2>
          <p className="mt-1 text-sm text-stone-600">
            Choose a date, time slot, and glucose value.
          </p>
          <div className="mt-5">
            <ReadingForm
              values={values}
              fieldErrors={fieldErrors}
              formError={formError}
              isSubmitting={isSubmitting}
              maxDate={maxDate}
              onChange={onChange}
              setFieldValue={setFieldValue}
              onSubmit={onSubmit}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:col-span-7 lg:p-8">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Your readings
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Use the icons to view, edit, or delete a reading.
              </p>
            </div>
            <p className="text-sm font-medium text-stone-500">
              {isLoading ? '…' : `${readings.length} saved`}
            </p>
          </div>
          <ReadingList
            readings={sortedReadings}
            isLoading={isLoading}
            error={error}
            sort={dateSort}
            onSortChange={setDateSort}
            onViewReading={setSelectedReadingId}
            onEditReading={openEdit}
            onDeleteReading={openDelete}
            onRetry={() => {
              void refetch()
            }}
          />
        </section>
      </div>

      <ReadingDetailModal
        open={selectedReadingId !== null}
        reading={detailReading}
        isLoading={isDetailLoading}
        error={detailError}
        onClose={() => setSelectedReadingId(null)}
        onRetry={retryDetail}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <ReadingEditModal
        open={editingReading !== null}
        reading={editingReading}
        onClose={() => setEditingReading(null)}
        onUpdated={(_reading, message) => {
          showSuccessToast(message)
          setEditingReading(null)
          void refetch()
        }}
      />

      <ReadingDeleteDialog
        open={deletingReading !== null}
        reading={deletingReading}
        isDeleting={isDeleting}
        onCancel={() => setDeletingReading(null)}
        onConfirm={() => {
          if (!deletingReading) {
            return
          }
          void deleteReading(deletingReading.id)
        }}
      />
    </AppShell>
  )
}
