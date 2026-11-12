import axios from 'axios'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { apiClient } from '@/lib/api-client'
import {
  registerFormSchema,
  type RegisterFormValues,
} from '@/lib/auth-schemas'
import { useAuthStore, type AuthUser } from '@/store/auth-store'

type FieldErrors = Partial<Record<keyof RegisterFormValues, string>>

type RegisterApiData = {
  user: AuthUser
  token: string
}

type ApiSuccess = {
  success: true
  message: string
  data: RegisterApiData
}

type ApiFailure = {
  success: false
  message: string
  errors?: Record<string, string[] | undefined>
}

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function mapZodFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): FieldErrors {
  const mapped: FieldErrors = {}
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) {
      mapped[key as keyof RegisterFormValues] = messages[0]
    }
  }
  return mapped
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)
  const [values, setValues] = useState<RegisterFormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    const fieldName = name as keyof RegisterFormValues
    const nextValues = { ...values, [fieldName]: value }

    setValues(nextValues)
    setFormError(null)
    setSuccessMessage(null)

    // Empty fields: clear that error while typing; full required check stays on submit.
    if (value === '') {
      setFieldErrors((current) => ({ ...current, [fieldName]: undefined }))
      return
    }

    const parsed = registerFormSchema.safeParse(nextValues)
    const nextErrors = parsed.success
      ? {}
      : mapZodFieldErrors(parsed.error.flatten().fieldErrors)

    setFieldErrors((current) => {
      const updated: FieldErrors = { ...current, [fieldName]: nextErrors[fieldName] }

      // Keep password + confirm in sync when either changes.
      if (fieldName === 'password' || fieldName === 'confirmPassword') {
        updated.password =
          nextValues.password === '' ? undefined : nextErrors.password
        updated.confirmPassword =
          nextValues.confirmPassword === ''
            ? undefined
            : nextErrors.confirmPassword
      }

      return updated
    })
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setSuccessMessage(null)

    const parsed = registerFormSchema.safeParse(values)
    if (!parsed.success) {
      setFieldErrors(mapZodFieldErrors(parsed.error.flatten().fieldErrors))
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await apiClient.post<ApiSuccess>('/auth/register', {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      })

      setSession(response.data.data.user, response.data.data.token)
      setSuccessMessage(response.data.message)
      setValues(initialValues)
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as ApiFailure
        if (data.errors) {
          setFieldErrors(mapZodFieldErrors(data.errors))
        }
        setFormError(data.message || 'Registration failed. Please try again.')
      } else {
        setFormError('Registration failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    fieldErrors,
    formError,
    successMessage,
    isSubmitting,
    onChange,
    onSubmit,
  }
}
