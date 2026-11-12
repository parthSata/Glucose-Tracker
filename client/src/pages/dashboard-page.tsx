import { Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { TIME_SLOT_OPTIONS } from '@/lib/time-slots'
import { useAuthStore } from '@/store/auth-store'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <AppShell
      title="Dashboard"
      subtitle={`Welcome${user?.name ? `, ${user.name}` : ''}. Track up to four glucose readings each day.`}
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:col-span-7 lg:p-8">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            Your account
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">
            Ready when you are
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            You are signed in
            {user?.email ? (
              <>
                {' '}
                as{' '}
                <span className="font-medium text-stone-800">{user.email}</span>
              </>
            ) : null}
            . Log readings by time slot, then review them anytime from the
            Readings page.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/readings"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Add reading
            </Link>
            <Link
              to="/readings"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
            >
              View readings
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-teal-200/70 bg-teal-50/70 p-6 shadow-sm lg:col-span-5 lg:p-8">
          <p className="text-sm font-semibold tracking-wide text-teal-900 uppercase">
            Daily limit
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-teal-950">
            4 slots per day
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-teal-900/80">
            One reading for each time of day. Values are recorded in mg/dl.
          </p>
          <ul className="mt-6 space-y-3">
            {TIME_SLOT_OPTIONS.map((slot, index) => (
              <li
                key={slot.value}
                className="flex items-center gap-3 rounded-xl border border-teal-200/80 bg-white/80 px-3 py-2.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-stone-800">
                  {slot.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm lg:col-span-12 lg:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Log by slot
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Pick a date, choose a time slot, and enter your glucose value.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Stay consistent
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Only one entry per slot per day keeps your history clean and
                reliable.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Review later
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Open Readings anytime to see what you have recorded, newest
                first.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
