import axios from 'axios'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { todayDateOnlyLocal } from '@/lib/date-only'
import { apiClient } from '@/lib/api-client'
import {
  mapReadingBusinessApiError,
  mapReadingFieldErrors,
  validateReadingBusinessRules,
  type ReadingFieldErrors,
} from '@/lib/reading-business-rules'
import {
  createReadingFormSchema,
  toCreateReadingPayload,
  type CreateReadingFormValues,
} from '@/lib/reading-schemas'
import { showErrorToast } from '@/lib/toast'
import type { Reading } from '@/types/reading'

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
  readings?: Reading[]
  onSuccess?: (reading: Reading, message: string) => void
}

const initialValues: CreateReadingFormValues = {
  readingDate: todayDateOnlyLocal(),
  timeSlot: '',
  value: '',
}

function mergeFieldErrors(
  values: CreateReadingFormValues,
  readings: Reading[],
): ReadingFieldErrors {
  const parsed = createReadingFormSchema.safeParse(values)
  const zodErrors = parsed.success
    ? {}
    : mapReadingFieldErrors(parsed.error.flatten().fieldErrors)
  const businessErrors = validateReadingBusinessRules(values, { readings })

  return {
    ...businessErrors,
    ...zodErrors,
  }
}

export function useCreateReading(options: UseCreateReadingOptions = {}) {
  const readings = options.readings ?? []
  const [values, setValues] = useState<CreateReadingFormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<ReadingFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setFieldValue(
    fieldName: keyof CreateReadingFormValues,
    value: string,
  ) {
    const nextValue =
      fieldName === 'value' ? value.replace(/\D/g, '') : value
    const nextValues = { ...values, [fieldName]: nextValue }

    setValues(nextValues)
    setFormError(null)

    if (nextValue === '') {
      setFieldErrors((current) => ({ ...current, [fieldName]: undefined }))
      return
    }

    const nextErrors = mergeFieldErrors(nextValues, readings)
    setFieldErrors((current) => ({
      ...current,
      [fieldName]: nextErrors[fieldName],
      readingDate: nextErrors.readingDate,
      timeSlot: nextErrors.timeSlot,
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
      setFieldErrors(mapReadingFieldErrors(parsed.error.flatten().fieldErrors))
      showErrorToast(
        parsed.error.issues[0]?.message ?? 'Please check the form and try again.',
      )
      return
    }

    const businessErrors = validateReadingBusinessRules(parsed.data, {
      readings,
    })
    if (Object.keys(businessErrors).length > 0) {
      setFieldErrors(businessErrors)
      const message =
        businessErrors.timeSlot ??
        businessErrors.readingDate ??
        'Please check the form and try again.'
      setFormError(message)
      showErrorToast(message)
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
        const fromApi = data.errors ? mapReadingFieldErrors(data.errors) : {}
        const fromMessage = mapReadingBusinessApiError(data.message || '')
        setFieldErrors({ ...fromMessage, ...fromApi })
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
