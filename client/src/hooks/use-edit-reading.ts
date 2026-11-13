import axios from 'axios'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { todayDateOnlyLocal } from '@/lib/date-only'
import { apiClient } from '@/lib/api-client'
import {
  readingFormSchema,
  readingToFormValues,
  toReadingPayload,
  type ReadingFormValues,
} from '@/lib/reading-schemas'
import { showErrorToast } from '@/lib/toast'
import type { Reading } from '@/types/reading'

type FieldErrors = Partial<Record<keyof ReadingFormValues, string>>

type ApiSuccess = {
  success: true
  message: string
  data: { reading: Reading }
}

type ApiFailure = {
  success: false
  message: string
  errors?: Record<string, string[] | undefined>
}

type UseEditReadingOptions = {
  reading: Reading | null
  onSuccess?: (reading: Reading, message: string) => void
}

const emptyValues: ReadingFormValues = {
  readingDate: todayDateOnlyLocal(),
  timeSlot: '',
  value: '',
}

function mapZodFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): FieldErrors {
  const mapped: FieldErrors = {}
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) {
      mapped[key as keyof ReadingFormValues] = messages[0]
    }
  }
  return mapped
}

export function useEditReading({ reading, onSuccess }: UseEditReadingOptions) {
  const [values, setValues] = useState<ReadingFormValues>(emptyValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!reading) {
      setValues(emptyValues)
      setFieldErrors({})
      setFormError(null)
      return
    }

    setValues(readingToFormValues(reading))
    setFieldErrors({})
    setFormError(null)
  }, [reading])

  function setFieldValue(fieldName: keyof ReadingFormValues, value: string) {
    const nextValues = { ...values, [fieldName]: value }

    setValues(nextValues)
    setFormError(null)

    if (value === '') {
      setFieldErrors((current) => ({ ...current, [fieldName]: undefined }))
      return
    }

    const parsed = readingFormSchema.safeParse(nextValues)
    const nextErrors = parsed.success
      ? {}
      : mapZodFieldErrors(parsed.error.flatten().fieldErrors)

    setFieldErrors((current) => ({
      ...current,
      [fieldName]: nextErrors[fieldName],
    }))
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setFieldValue(name as keyof ReadingFormValues, value)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!reading) {
      return
    }

    setFormError(null)

    const parsed = readingFormSchema.safeParse(values)
    if (!parsed.success) {
      const nextErrors = mapZodFieldErrors(parsed.error.flatten().fieldErrors)
      setFieldErrors(nextErrors)
      showErrorToast(
        parsed.error.issues[0]?.message ?? 'Please check the form and try again.',
      )
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const payload = toReadingPayload(parsed.data)
      const response = await apiClient.put<ApiSuccess>(
        `/readings/${reading.id}`,
        payload,
      )

      onSuccess?.(
        response.data.data.reading,
        response.data.message || 'Reading updated successfully.',
      )
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as ApiFailure
        if (data.errors) {
          setFieldErrors(mapZodFieldErrors(data.errors))
        }
        const message = data.message || 'Could not update reading.'
        setFormError(message)
        showErrorToast(message)
      } else {
        const message = 'Could not update reading. Please try again.'
        setFormError(message)
        showErrorToast(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    maxDate: todayDateOnlyLocal(),
    onChange,
    setFieldValue,
    onSubmit,
  }
}
