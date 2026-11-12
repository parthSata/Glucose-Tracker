import axios from 'axios'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { todayDateOnlyLocal } from '@/lib/date-only'
import { apiClient } from '@/lib/api-client'
import {
  createReadingFormSchema,
  toCreateReadingPayload,
  type CreateReadingFormValues,
} from '@/lib/reading-schemas'
import { showErrorToast } from '@/lib/toast'
import type { Reading } from '@/types/reading'

type FieldErrors = Partial<Record<keyof CreateReadingFormValues, string>>

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

type UseCreateReadingOptions = {
  onSuccess?: (reading: Reading, message: string) => void
}

const initialValues: CreateReadingFormValues = {
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
      mapped[key as keyof CreateReadingFormValues] = messages[0]
    }
  }
  return mapped
}

export function useCreateReading(options: UseCreateReadingOptions = {}) {
  const [values, setValues] = useState<CreateReadingFormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setFieldValue(
    fieldName: keyof CreateReadingFormValues,
    value: string,
  ) {
    const nextValues = { ...values, [fieldName]: value }

    setValues(nextValues)
    setFormError(null)

    if (value === '') {
      setFieldErrors((current) => ({ ...current, [fieldName]: undefined }))
      return
    }

    const parsed = createReadingFormSchema.safeParse(nextValues)
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
    setFieldValue(name as keyof CreateReadingFormValues, value)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const parsed = createReadingFormSchema.safeParse(values)
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
      const payload = toCreateReadingPayload(parsed.data)
      const response = await apiClient.post<ApiSuccess>('/readings', payload)

      setValues({
        readingDate: todayDateOnlyLocal(),
        timeSlot: '',
        value: '',
      })
      options.onSuccess?.(
        response.data.data.reading,
        response.data.message || 'Reading saved successfully.',
      )
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as ApiFailure
        if (data.errors) {
          setFieldErrors(mapZodFieldErrors(data.errors))
        }
        const message = data.message || 'Could not save reading.'
        setFormError(message)
        showErrorToast(message)
      } else {
        const message = 'Could not save reading. Please try again.'
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
