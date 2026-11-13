import { DashboardAddAction } from '@/components/features/dashboard/dashboard-add-action'
import { DashboardStats } from '@/components/features/dashboard/dashboard-stats'
import { DashboardTodayList } from '@/components/features/dashboard/dashboard-today-list'
import { DashboardWelcome } from '@/components/features/dashboard/dashboard-welcome'
import { AppShell } from '@/components/layout/app-shell'
import { EmptyState } from '@/components/ui/empty-state'
import { useDashboard } from '@/hooks/use-dashboard'

export default function DashboardPage() {
  const {
    userName,
    todayDateLabel,
    todayReadings,
    todayStats,
    completionCount,
    completionMax,
    totalReadings,
    hasAnyReadings,
    isLoading,
    error,
    refetch,
  } = useDashboard()

  return (
    <AppShell
      title="Dashboard"
      subtitle="Today’s readings and a quick look at your glucose overview."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <DashboardWelcome
              userName={userName}
              dateLabel={todayDateLabel}
            />
            <DashboardAddAction className="w-full sm:w-auto sm:shrink-0" />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold tracking-wide text-stone-500 uppercase">
            Quick stats
          </h3>
          <DashboardStats
            completionCount={completionCount}
            completionMax={completionMax}
            todayStats={todayStats}
            totalReadings={totalReadings}
          />
        </section>

        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:p-8">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-stone-900">
                Today’s readings
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Up to four slots: morning fasting through after dinner.
              </p>
            </div>
            {!isLoading && !error ? (
              <p className="text-sm font-medium text-stone-500">
                {completionCount} of {completionMax} logged
              </p>
            ) : null}
          </div>

          {!isLoading && !error && !hasAnyReadings ? (
            <div className="space-y-4">
              <EmptyState
                title="No glucose readings yet"
                description="Start recording your readings to see today’s list and your stats here."
              />
              <DashboardAddAction className="w-full sm:mx-auto sm:max-w-56" />
            </div>
          ) : (
            <DashboardTodayList
              readings={todayReadings}
              isLoading={isLoading}
              error={error}
              onRetry={() => {
                void refetch()
              }}
            />
          )}
        </section>
      </div>
    </AppShell>
  )
}
