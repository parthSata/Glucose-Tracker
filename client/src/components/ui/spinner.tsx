type SpinnerProps = {
  label?: string
}

export function Spinner({ label = 'Loading…' }: SpinnerProps) {
  return (
    <div
      className="flex min-h-40 flex-col items-center justify-center gap-3 text-stone-600"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-teal-700 border-t-transparent"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
