import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

export function HomeRedirect() {
  const token = useAuthStore((state) => state.token)
  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}
