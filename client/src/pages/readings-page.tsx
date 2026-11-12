import { AppShell } from '@/components/layout/app-shell'
import { ReadingForm } from '@/components/features/readings/reading-form'
import { ReadingList } from '@/components/features/readings/reading-list'
import { useCreateReading } from '@/hooks/use-create-reading'
import { useReadings } from '@/hooks/use-readings'
import { showSuccessToast } from '@/lib/toast'

export default function ReadingsPage() {
  const { readings, isLoading, error, refetch } = useReadings()

  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    maxDate,
    onChange,
    onSubmit,
  } = useCreateReading({
    onSuccess: (_reading, message) => {
      showSuccessToast(message)
      void refetch()
    },
  })

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
              <p className="mt-1 text-sm text-stone-600">Newest dates first.</p>
            </div>
            <p className="text-sm font-medium text-stone-500">
              {isLoading ? '…' : `${readings.length} saved`}
            </p>
          </div>
          <ReadingList
            readings={readings}
            isLoading={isLoading}
            error={error}
            onRetry={() => {
              void refetch()
            }}
          />
        </section>
      </div>
    </AppShell>
  )
}
