import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/use-logout'

type AppShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const { logout, isLoggingOut } = useLogout()

  return (
    <div className="min-h-screen">
      <header className="border-b border-teal-900/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <NavLink to="/dashboard" className="shrink-0">
              <span className="text-sm font-bold tracking-[0.18em] text-teal-800 uppercase">
                Sweety
              </span>
            </NavLink>
            <nav className="flex flex-wrap items-center gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-teal-700 text-white'
                      : 'text-stone-700 hover:bg-teal-50 hover:text-teal-900'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/readings"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-teal-700 text-white'
                      : 'text-stone-700 hover:bg-teal-50 hover:text-teal-900'
                  }`
                }
              >
                Readings
              </NavLink>
            </nav>
          </div>

          <div className="w-full sm:w-auto sm:min-w-28">
            <Button
              type="button"
              variant="secondary"
              disabled={isLoggingOut}
              className="sm:!w-auto"
              onClick={() => {
                void logout()
              }}
            >
              {isLoggingOut ? 'Signing out…' : 'Log out'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-base text-stone-600">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  )
}
