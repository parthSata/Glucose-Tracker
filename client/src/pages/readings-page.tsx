import { useEffect, useState } from 'react'
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
  clampPage,
  getTotalPages,
  paginateItems,
  READINGS_PAGE_SIZE,
} from '@/lib/paginate'
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
  const [page, setPage] = useState(1)
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(
    null,
  )
  const [editingReading, setEditingReading] = useState<Reading | null>(null)
  const [deletingReading, setDeletingReading] = useState<Reading | null>(null)

  const sortedReadings = sortReadingsByDate(readings, dateSort)
  const totalItems = sortedReadings.length
  const totalPages = getTotalPages(totalItems, READINGS_PAGE_SIZE)
  const safePage = clampPage(page, totalPages)
  const pageReadings = paginateItems(
    sortedReadings,
    safePage,
    READINGS_PAGE_SIZE,
  )

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage)
    }
  }, [page, safePage])

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
    readings,
    onSuccess: (_reading, message) => {
      showSuccessToast(message)
      setPage(1)
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

  function handleSortChange(nextSort: ReadingDateSort) {
    setDateSort(nextSort)
    setPage(1)
  }

  return (
    <AppShell
      title="Readings"
      subtitle="Log up to four glucose readings per day. Values use mg/dl."
    >
      <div className="grid items-start gap-6 lg:grid-cols-12">
        <section className="overflow-hidden rounded-2xl border border-teal-200/60 bg-white/95 shadow-sm lg:col-span-5">
          <div className="border-b border-teal-100 bg-gradient-to-r from-teal-700 to-emerald-600 px-6 py-5 text-white lg:px-8">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-90">
              New entry
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Add reading
            </h2>
            <p className="mt-1.5 text-sm text-teal-50/90">
              Date, time slot, and glucose value in mg/dl.
            </p>
          </div>
          <div className="p-6 lg:p-8">
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

        <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white/95 shadow-sm lg:col-span-7">
          <div className="flex flex-col gap-3 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-teal-50/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-teal-800 uppercase">
                History
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
                Your readings
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Browse, edit, or remove logged values.
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-teal-700 px-3 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm">
              {isLoading ? '…' : `${totalItems} saved`}
            </span>
          </div>
          <div className="p-6 lg:p-8">
            <ReadingList
              readings={pageReadings}
              isLoading={isLoading}
              error={error}
              sort={dateSort}
              page={safePage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={READINGS_PAGE_SIZE}
              onSortChange={handleSortChange}
              onPageChange={setPage}
              onViewReading={setSelectedReadingId}
              onEditReading={openEdit}
              onDeleteReading={openDelete}
              onRetry={() => {
                void refetch()
              }}
            />
          </div>
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
        readings={readings}
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
