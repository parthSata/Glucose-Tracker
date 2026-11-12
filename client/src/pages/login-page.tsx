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
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-teal-900 px-10 py-12 text-teal-50 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.35),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.25),transparent_40%)]" />
        <div className="relative">
          <p className="text-sm font-bold tracking-[0.2em] uppercase">Sweety</p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
            Your calm place for daily glucose tracking.
          </h1>
          <p className="mt-4 max-w-md text-base text-teal-100/90">
            Log up to four readings a day, keep slots unique, and review your
            history whenever you need it.
          </p>
        </div>
        <p className="relative text-sm text-teal-100/70">
          Personal tracker · mg/dl · private to you
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase lg:hidden">
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
      </section>
    </main>
  )
}
