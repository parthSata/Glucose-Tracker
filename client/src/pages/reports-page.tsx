import { useState } from 'react'
import { DailyReadingList } from '@/components/features/reports/daily-reading-list'
import { ReportDatePicker } from '@/components/features/reports/report-date-picker'
import { ReportEmptyState } from '@/components/features/reports/report-empty-state'
import { ReportSummary } from '@/components/features/reports/report-summary'
import { ReportTypeSwitcher } from '@/components/features/reports/report-type-switcher'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatDisplayDateRange } from '@/lib/format-display-date'
import { useReport } from '@/hooks/use-report'
import type { DailyReport, ReportKind } from '@/types/report'

const REPORT_COPY: Record<
  ReportKind,
  { eyebrow: string; title: string; description: string; loading: string }
> = {
  daily: {
    eyebrow: 'Daily report',
    title: 'Choose a date',
    description:
      'Stats and readings are scoped to your account for the selected calendar day.',
    loading: 'Loading daily report…',
  },
  'month-to-date': {
    eyebrow: 'Month-to-date report',
    title: 'Choose an end date',
    description:
      'Covers the 1st of that month through your selected date (inclusive).',
    loading: 'Loading month-to-date report…',
  },
}

export default function ReportsPage() {
  const [kind, setKind] = useState<ReportKind>('daily')
  const {
    selectedDate,
    setSelectedDate,
    dateError,
    maxDate,
    report,
    isLoading,
    error,
    refetch,
  } = useReport(kind)

  const copy = REPORT_COPY[kind]
  const rangeLabel = report
    ? formatDisplayDateRange(report.range.start, report.range.end)
    : formatDisplayDateRange(selectedDate, selectedDate)

  const dailyReadings =
    kind === 'daily' && report && 'readings' in report
      ? (report as DailyReport).readings
      : []

  return (
    <AppShell
      title="Reports"
      subtitle="Review highest, lowest, and average glucose for the period you select."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:p-8">
          <ReportTypeSwitcher value={kind} onChange={setKind} />
          <p className="mt-5 text-sm font-semibold tracking-wide text-teal-800 uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">
            {copy.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            {copy.description}
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
            <Spinner label={copy.loading} />
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
              Choose a valid date to view the report.
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

              {kind === 'daily' ? (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-stone-900">
                    Readings for this day
                  </h3>
                  <DailyReadingList readings={dailyReadings} />
                </div>
              ) : report.count === 0 ? (
                <ReportEmptyState />
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  )
}
