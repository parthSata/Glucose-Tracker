import { DailyReadingList } from '@/components/features/reports/daily-reading-list'
import { ReportDatePicker } from '@/components/features/reports/report-date-picker'
import { ReportSummary } from '@/components/features/reports/report-summary'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatDisplayDate } from '@/lib/format-display-date'
import { useDailyReport } from '@/hooks/use-daily-report'

export default function ReportsPage() {
  const {
    selectedDate,
    setSelectedDate,
    dateError,
    maxDate,
    report,
    isLoading,
    error,
    refetch,
  } = useDailyReport()

  const rangeLabel = report
    ? formatDisplayDate(report.range.start)
    : formatDisplayDate(selectedDate)

  return (
    <AppShell
      title="Reports"
      subtitle="Review highest, lowest, and average glucose for a selected day."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:p-8">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            Daily report
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">
            Choose a date
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Stats and readings are scoped to your account for the selected
            calendar day.
          </p>
          <div className="mt-5">
            <ReportDatePicker
              value={selectedDate}
              maxDate={maxDate}
              error={dateError}
              onChange={setSelectedDate}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:p-8">
          {isLoading ? (
            <Spinner label="Loading daily report…" />
          ) : error ? (
            <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-6 text-center">
              <p className="text-sm font-medium text-red-800">{error}</p>
              <Button
                type="button"
                variant="secondary"
                className="mx-auto max-w-40"
                onClick={() => {
                  void refetch()
                }}
              >
                Try again
              </Button>
            </div>
          ) : dateError ? (
            <p className="text-sm text-stone-600">
              Choose a valid date to view the daily report.
            </p>
          ) : report ? (
            <div className="space-y-8">
              <ReportSummary
                rangeLabel={rangeLabel}
                highest={report.highest}
                lowest={report.lowest}
                average={report.average}
                count={report.count}
              />

              <div>
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
                  Readings for this day
                </h3>
                <DailyReadingList readings={report.readings} />
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  )
}
