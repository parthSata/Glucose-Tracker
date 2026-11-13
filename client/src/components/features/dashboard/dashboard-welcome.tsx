type DashboardWelcomeProps = {
  userName: string
  dateLabel: string
}

export function DashboardWelcome({
  userName,
  dateLabel,
}: DashboardWelcomeProps) {
  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
        {dateLabel}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
        Welcome back, {userName}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
        Here is your glucose overview for today. Log up to four readings, then
        review your highest, lowest, and average values at a glance.
      </p>
    </div>
  )
}
