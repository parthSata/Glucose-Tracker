import { RegisterForm } from '@/components/features/auth/register-form'
import { useRegister } from '@/hooks/use-register'

export default function RegisterPage() {
  const {
    values,
    fieldErrors,
    formError,
    successMessage,
    isSubmitting,
    onChange,
    onSubmit,
  } = useRegister()

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-teal-900 px-10 py-12 text-teal-50 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.35),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.25),transparent_40%)]" />
        <div className="relative">
          <p className="text-sm font-bold tracking-[0.2em] uppercase">Sweety</p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
            Start tracking in a few calm steps.
          </h1>
          <p className="mt-4 max-w-md text-base text-teal-100/90">
            Create an account to log morning, breakfast, lunch, and dinner
            readings with clear validation.
          </p>
        </div>
        <p className="relative text-sm text-teal-100/70">
          Free personal use · secure password · JWT session
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase lg:hidden">
            Sweety
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Register to start logging your blood glucose readings.
          </p>

          <div className="mt-6">
            <RegisterForm
              values={values}
              fieldErrors={fieldErrors}
              formError={formError}
              successMessage={successMessage}
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
