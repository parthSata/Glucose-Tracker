import { EmptyState } from '@/components/ui/empty-state'

export function ReportEmptyState() {
  return (
    <EmptyState
      title="No glucose readings found for this period."
      description="Start recording your readings to see your report."
    />
  )
}
