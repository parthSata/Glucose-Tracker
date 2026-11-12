import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/components/features/auth/login-form'
import { useLogin } from '@/hooks/use-login'
import { useAuthStore } from '@/store/auth-store'

export default function LoginPage() {
  const token = useAuthStore((state) => state.token)
  const {
    values,
    fieldErrors,
    formError,
    isSubmitting,
    onChange,
    onSubmit,
  } = useLogin()

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
          Sweety
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
          Log in
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Sign in to view and manage your glucose readings.
        </p>

        <div className="mt-6">
          <LoginForm
            values={values}
            fieldErrors={fieldErrors}
            formError={formError}
            isSubmitting={isSubmitting}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </main>
  )
}
