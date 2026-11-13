import type { ChangeEvent, FormEvent } from 'react'
import type { ReadingFormValues } from '@/lib/reading-schemas'
import { TIME_SLOT_OPTIONS } from '@/lib/time-slots'
import { Button } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import { ErrorText } from '@/components/ui/error-text'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ReadingFormProps = {
  values: ReadingFormValues
  fieldErrors: Partial<Record<keyof ReadingFormValues, string>>
  formError: string | null
  isSubmitting: boolean
  maxDate: string
  submitLabel?: string
  submittingLabel?: string
  idPrefix?: string
  onCancel?: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  setFieldValue: (fieldName: keyof ReadingFormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ReadingForm({
  values,
  fieldErrors,
  formError,
  isSubmitting,
  maxDate,
  submitLabel = 'Save reading',
  submittingLabel = 'Saving…',
  idPrefix = '',
  onCancel,
  onChange,
  setFieldValue,
  onSubmit,
}: ReadingFormProps) {
  function fieldId(name: string) {
    return idPrefix ? `${idPrefix}-${name}` : name
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
      noValidate
      aria-describedby={formError ? fieldId('form-error') : undefined}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor={fieldId('readingDate')} requiredMark>
            Date
          </Label>
          <Input
            id={fieldId('readingDate')}
            name="readingDate"
            type="date"
            max={maxDate}
            value={values.readingDate}
            onChange={onChange}
            hasError={Boolean(fieldErrors.readingDate)}
            aria-invalid={Boolean(fieldErrors.readingDate)}
            aria-describedby={
              fieldErrors.readingDate ? fieldId('date-error') : undefined
            }
          />
          <ErrorText
            id={fieldId('date-error')}
            message={fieldErrors.readingDate}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={fieldId('timeSlot')} requiredMark>
            Time slot
          </Label>
          <Dropdown
            id={fieldId('timeSlot')}
            name="timeSlot"
            value={values.timeSlot}
            placeholder="Select a time slot"
            options={TIME_SLOT_OPTIONS}
            hasError={Boolean(fieldErrors.timeSlot)}
            aria-invalid={Boolean(fieldErrors.timeSlot)}
            aria-describedby={
              fieldErrors.timeSlot ? fieldId('slot-error') : undefined
            }
            onChange={(nextValue) => setFieldValue('timeSlot', nextValue)}
          />
          <ErrorText
            id={fieldId('slot-error')}
            message={fieldErrors.timeSlot}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={fieldId('value')} requiredMark>
            Glucose value
          </Label>
          <div className="flex items-stretch gap-2">
            <Input
              id={fieldId('value')}
              name="value"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder="e.g. 110"
              value={values.value}
              onChange={onChange}
              onKeyDown={(event) => {
                if (event.ctrlKey || event.metaKey || event.altKey) {
                  return
                }
                const allowedKeys = [
                  'Backspace',
                  'Delete',
                  'Tab',
                  'Escape',
                  'Enter',
                  'ArrowLeft',
                  'ArrowRight',
                  'ArrowUp',
                  'ArrowDown',
                  'Home',
                  'End',
                ]
                if (allowedKeys.includes(event.key)) {
                  return
                }
                if (!/^\d$/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              hasError={Boolean(fieldErrors.value)}
              aria-invalid={Boolean(fieldErrors.value)}
              aria-describedby={
                fieldErrors.value ? fieldId('value-error') : fieldId('value-unit')
              }
              className="flex-1"
            />
            <span
              id={fieldId('value-unit')}
              className="inline-flex min-h-11 items-center rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm font-medium text-stone-600"
            >
              mg/dl
            </span>
          </div>
          <ErrorText
            id={fieldId('value-error')}
            message={fieldErrors.value}
          />
        </div>
      </div>

      {formError ? (
        <p
          id={fieldId('form-error')}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <div className={`grid gap-3 ${onCancel ? 'sm:grid-cols-2' : ''}`}>
        {onCancel ? (
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
