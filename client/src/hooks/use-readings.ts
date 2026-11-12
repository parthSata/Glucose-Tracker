import axios from 'axios'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import type { Reading } from '@/types/reading'

type ApiSuccess = {
  success: true
  message: string
  data: { readings: Reading[] }
}

type ApiFailure = {
  success: false
  message: string
}

export function useReadings() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchReadings() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<ApiSuccess>('/readings')
        if (!cancelled) {
          setReadings(response.data.data.readings)
        }
      } catch (err: unknown) {
        if (cancelled) {
          return
        }

        if (axios.isAxiosError(err) && err.response?.data) {
          const data = err.response.data as ApiFailure
          setError(data.message || 'Could not load readings.')
        } else {
          setError('Could not load readings. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchReadings()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  function refetch() {
    setReloadKey((current) => current + 1)
  }

  return {
    readings,
    isLoading,
    error,
    refetch,
  }
}
