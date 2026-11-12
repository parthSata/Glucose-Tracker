import { RegisterForm } from '../components/features/auth/register-form'
import { useRegister } from '../hooks/use-register'

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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
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
    </main>
  )
}
