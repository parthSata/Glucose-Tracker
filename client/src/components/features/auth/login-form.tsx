import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { LoginFormValues } from '@/lib/auth-schemas'
import { Button } from '@/components/ui/button'
import { ErrorText } from '@/components/ui/error-text'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LoginFormProps = {
  values: LoginFormValues
  fieldErrors: Partial<Record<keyof LoginFormValues, string>>
  formError: string | null
  isSubmitting: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function LoginForm({
  values,
  fieldErrors,
  formError,
  isSubmitting,
  onChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-4"
      noValidate
      aria-describedby={formError ? 'login-form-error' : undefined}
    >
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
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
        />
        <ErrorText id="login-email-error" message={fieldErrors.email} />
      </div>

      <div>
        <Label htmlFor="password" requiredMark>
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={onChange}
          hasError={Boolean(fieldErrors.password)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? 'login-password-error' : undefined
          }
        />
        <ErrorText id="login-password-error" message={fieldErrors.password} />
      </div>

      {formError ? (
        <p
          id="login-form-error"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Log in'}
      </Button>

      <p className="text-center text-sm text-stone-600">
        Need an account?{' '}
        <Link
          to="/register"
          className="font-medium text-teal-800 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}
