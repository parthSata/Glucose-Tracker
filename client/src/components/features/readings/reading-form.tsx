import type { ChangeEvent, FormEvent } from 'react'
import type { CreateReadingFormValues } from '@/lib/reading-schemas'
import { TIME_SLOT_OPTIONS } from '@/lib/time-slots'
import { Button } from '@/components/ui/button'
import { ErrorText } from '@/components/ui/error-text'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

type ReadingFormProps = {
  values: CreateReadingFormValues
  fieldErrors: Partial<Record<keyof CreateReadingFormValues, string>>
  formError: string | null
  isSubmitting: boolean
  maxDate: string
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ReadingForm({
  values,
  fieldErrors,
  formError,
  isSubmitting,
  maxDate,
  onChange,
  onSubmit,
}: ReadingFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
      noValidate
      aria-describedby={formError ? 'reading-form-error' : undefined}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="readingDate" requiredMark>
            Date
          </Label>
          <Input
            id="readingDate"
            name="readingDate"
            type="date"
            max={maxDate}
            value={values.readingDate}
            onChange={onChange}
            hasError={Boolean(fieldErrors.readingDate)}
            aria-invalid={Boolean(fieldErrors.readingDate)}
            aria-describedby={
              fieldErrors.readingDate ? 'reading-date-error' : undefined
            }
          />
          <ErrorText id="reading-date-error" message={fieldErrors.readingDate} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="timeSlot" requiredMark>
            Time slot
          </Label>
          <Select
            id="timeSlot"
            name="timeSlot"
            value={values.timeSlot}
            onChange={onChange}
            hasError={Boolean(fieldErrors.timeSlot)}
            aria-invalid={Boolean(fieldErrors.timeSlot)}
            aria-describedby={
              fieldErrors.timeSlot ? 'reading-slot-error' : undefined
            }
          >
            <option value="" disabled>
              Select a time slot
            </option>
            {TIME_SLOT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <ErrorText id="reading-slot-error" message={fieldErrors.timeSlot} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="value" requiredMark>
            Glucose value
          </Label>
          <div className="flex items-stretch gap-2">
            <Input
              id="value"
              name="value"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 110"
              value={values.value}
              onChange={onChange}
              hasError={Boolean(fieldErrors.value)}
              aria-invalid={Boolean(fieldErrors.value)}
              aria-describedby={
                fieldErrors.value ? 'reading-value-error' : 'reading-value-unit'
              }
              className="flex-1"
            />
            <span
              id="reading-value-unit"
              className="inline-flex min-h-11 items-center rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm font-medium text-stone-600"
            >
              mg/dl
            </span>
          </div>
          <ErrorText id="reading-value-error" message={fieldErrors.value} />
        </div>
      </div>

      {formError ? (
        <p
          id="reading-form-error"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save reading'}
      </Button>
    </form>
  )
}
