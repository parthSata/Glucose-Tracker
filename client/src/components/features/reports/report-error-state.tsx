import { Button } from '@/components/ui/button'

type ReportErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ReportErrorState({ message, onRetry }: ReportErrorStateProps) {
  return (
    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-6 text-center">
      <p className="text-sm font-medium text-red-800">{message}</p>
      <Button
        type="button"
        variant="secondary"
        className="mx-auto max-w-40"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  )
}
