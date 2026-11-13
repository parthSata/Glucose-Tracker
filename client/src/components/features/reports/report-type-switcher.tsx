import type { ReportKind } from '@/types/report'

type ReportTypeSwitcherProps = {
  value: ReportKind
  onChange: (kind: ReportKind) => void
}

const OPTIONS: Array<{ value: ReportKind; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'month-to-date', label: 'Month-to-date' },
  { value: 'monthly', label: 'Monthly' },
]

export function ReportTypeSwitcher({
  value,
  onChange,
}: ReportTypeSwitcherProps) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1"
      role="tablist"
      aria-label="Report type"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
              isActive
                ? 'bg-teal-700 text-white'
                : 'text-stone-700 hover:bg-white hover:text-teal-900'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
