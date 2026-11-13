import type { ReadingDateSort } from '@/lib/sort-readings'
import { READING_DATE_SORT_OPTIONS } from '@/lib/sort-readings'

type ReadingSortToggleProps = {
  value: ReadingDateSort
  onChange: (sort: ReadingDateSort) => void
}

export function ReadingSortToggle({
  value,
  onChange,
}: ReadingSortToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-teal-200/80 bg-teal-50/60 p-1"
      role="group"
      aria-label="Sort readings by date"
    >
      {READING_DATE_SORT_OPTIONS.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`min-h-8 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
              isActive
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-teal-900/70 hover:bg-white/70 hover:text-teal-950'
            }`}
          >
            {option.value === 'newest' ? 'Newest' : 'Oldest'}
          </button>
        )
      })}
    </div>
  )
}
