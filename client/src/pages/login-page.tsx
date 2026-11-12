import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
          Sweety
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">Log in</h1>
        <p className="mt-2 text-sm text-stone-600">
          Login form comes next. You can register now.
        </p>
        <p className="mt-6 text-sm text-stone-600">
          Need an account?{' '}
          <Link
            to="/register"
            className="font-medium text-teal-800 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
