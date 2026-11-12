import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import { useRequireAuth } from '@/hooks/use-require-auth'

export function ProtectedRoute() {
  const status = useRequireAuth()

  if (status === 'loading') {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
        <Spinner label="Checking session…" />
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
