import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { RegisterFormValues } from '@/lib/auth-schemas'
import { Button } from '@/components/ui/button'
import { ErrorText } from '@/components/ui/error-text'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type RegisterFormProps = {
  values: RegisterFormValues
  fieldErrors: Partial<Record<keyof RegisterFormValues, string>>
  formError: string | null
  successMessage: string | null
  isSubmitting: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function RegisterForm({
  values,
  fieldErrors,
  formError,
  successMessage,
  isSubmitting,
  onChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-4"
      noValidate
      aria-describedby={formError ? 'register-form-error' : undefined}
    >
      <div>
        <Label htmlFor="name" requiredMark>
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={onChange}
          hasError={Boolean(fieldErrors.name)}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
        />
        <ErrorText id="name-error" message={fieldErrors.name} />
      </div>

      <div>
        <Label htmlFor="email" requiredMark>
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={onChange}
          hasError={Boolean(fieldErrors.email)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        <ErrorText id="email-error" message={fieldErrors.email} />
      </div>

      <div>
        <Label htmlFor="password" requiredMark>
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={onChange}
          hasError={Boolean(fieldErrors.password)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? 'password-error' : undefined}
        />
        <ErrorText id="password-error" message={fieldErrors.password} />
      </div>

      <div>
        <Label htmlFor="confirmPassword" requiredMark>
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={onChange}
          hasError={Boolean(fieldErrors.confirmPassword)}
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={
            fieldErrors.confirmPassword ? 'confirm-password-error' : undefined
          }
        />
        <ErrorText
          id="confirm-password-error"
          message={fieldErrors.confirmPassword}
        />
      </div>

      {formError ? (
        <p
          id="register-form-error"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      {successMessage ? (
        <p
          className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-stone-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-teal-800 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
