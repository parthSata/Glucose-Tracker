type PaginationProps = {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalItems <= pageSize) {
    return null
  }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50/50 to-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <p className="text-xs font-medium text-stone-600">
        Showing{' '}
        <span className="font-semibold text-teal-900">
          {from}–{to}
        </span>{' '}
        of <span className="font-semibold text-stone-800">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-stone-200 bg-white px-3.5 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-teal-300 hover:text-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-teal-700 px-2.5 py-1 text-xs font-bold text-white">
          {page}/{totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-stone-200 bg-white px-3.5 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-teal-300 hover:text-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
