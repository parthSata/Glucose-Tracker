import axios from 'axios'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api-client'
import {
  loginFormSchema,
  type LoginFormValues,
} from '@/lib/auth-schemas'
import { useAuthStore, type AuthUser } from '@/store/auth-store'

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>

type LoginApiData = {
  user: AuthUser
  token: string
}

type ApiSuccess = {
  success: true
  message: string
  data: LoginApiData
}

type ApiFailure = {
  success: false
  message: string
  errors?: Record<string, string[] | undefined>
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
}

function mapZodFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): FieldErrors {
  const mapped: FieldErrors = {}
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) {
      mapped[key as keyof LoginFormValues] = messages[0]
    }
  }
  return mapped
}

export function useLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    const fieldName = name as keyof LoginFormValues
    const nextValues = { ...values, [fieldName]: value }

    setValues(nextValues)
    setFormError(null)

    if (value === '') {
      setFieldErrors((current) => ({ ...current, [fieldName]: undefined }))
      return
    }

    const parsed = loginFormSchema.safeParse(nextValues)
    const nextErrors = parsed.success
      ? {}
      : mapZodFieldErrors(parsed.error.flatten().fieldErrors)

    setFieldErrors((current) => ({
      ...current,
      [fieldName]: nextErrors[fieldName],
    }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const parsed = loginFormSchema.safeParse(values)
    if (!parsed.success) {
      setFieldErrors(mapZodFieldErrors(parsed.error.flatten().fieldErrors))
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await apiClient.post<ApiSuccess>('/auth/login', {
        email: parsed.data.email,
        password: parsed.data.password,
      })

      setSession(response.data.data.user, response.data.data.token)
      navigate('/dashboard', { replace: true })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as ApiFailure
        if (data.errors) {
          setFieldErrors(mapZodFieldErrors(data.errors))
        }
        setFormError(data.message || 'Invalid email or password.')
      } else {
        setFormError('Login failed. Please try again.')
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
    onChange,
    onSubmit,
  }
}
