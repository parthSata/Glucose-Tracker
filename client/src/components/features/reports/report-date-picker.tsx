import type { ChangeEvent } from 'react'
import { ErrorText } from '@/components/ui/error-text'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ReportDatePickerProps = {
  id?: string
  label?: string
  value: string
  maxDate: string
  error: string | null
  onChange: (date: string) => void
}

export function ReportDatePicker({
  id = 'report-date',
  label = 'Report date',
  value,
  maxDate,
  error,
  onChange,
}: ReportDatePickerProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  return (
    <div className="w-full max-w-xs">
      <Label htmlFor={id} requiredMark>
        {label}
      </Label>
      <Input
        id={id}
        name="date"
        type="date"
        max={maxDate}
        value={value}
        onChange={handleChange}
        hasError={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <ErrorText id={`${id}-error`} message={error ?? undefined} />
    </div>
  )
}
