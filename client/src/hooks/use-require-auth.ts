import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { useAuthStore, type AuthUser } from '@/store/auth-store'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type MeResponse = {
  success: true
  data: {
    user: AuthUser
  }
}

export function useRequireAuth(): AuthStatus {
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const [status, setStatus] = useState<AuthStatus>(
    token ? 'loading' : 'unauthenticated',
  )

  useEffect(() => {
    if (!token) {
      setStatus('unauthenticated')
      return
    }

    let cancelled = false

    async function verifySession() {
      try {
        const response = await apiClient.get<MeResponse>('/auth/me')
        if (cancelled) {
          return
        }

        setSession(response.data.data.user, token as string)
        setStatus('authenticated')
      } catch {
        if (cancelled) {
          return
        }

        clearSession()
        setStatus('unauthenticated')
      }
    }

    void verifySession()

    return () => {
      cancelled = true
    }
  }, [token, setSession, clearSession])

  return status
}
