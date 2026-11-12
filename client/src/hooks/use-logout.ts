import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api-client'
import { showSuccessToast } from '@/lib/toast'
import { useAuthStore } from '@/store/auth-store'

export function useLogout() {
  const navigate = useNavigate()
  const clearSession = useAuthStore((state) => state.clearSession)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function logout() {
    setIsLoggingOut(true)

    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Always clear local session even if the network call fails.
    } finally {
      clearSession()
      setIsLoggingOut(false)
      showSuccessToast('Logged out successfully.')
      navigate('/login', { replace: true })
    }
  }

  return {
    logout,
    isLoggingOut,
  }
}
