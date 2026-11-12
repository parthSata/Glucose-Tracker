import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/use-logout'
import { useAuthStore } from '@/store/auth-store'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { logout, isLoggingOut } = useLogout()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-teal-800 uppercase">
            Sweety
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Welcome{user?.name ? `, ${user.name}` : ''}. Readings come next.
          </p>
        </div>
        <div className="sm:w-40">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoggingOut}
            onClick={() => {
              void logout()
            }}
          >
            {isLoggingOut ? 'Signing out…' : 'Log out'}
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-sm text-stone-600">
          You are signed in
          {user?.email ? (
            <>
              {' '}
              as <span className="font-medium text-stone-800">{user.email}</span>
            </>
          ) : null}
          .
        </p>
      </section>
    </main>
  )
}
