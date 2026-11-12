import axios from 'axios'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { showErrorToast } from '@/lib/toast'
import type { Reading } from '@/types/reading'

type ApiSuccess = {
  success: true
  message: string
  data: { reading: Reading }
}

type ApiFailure = {
  success: false
  message: string
}

export function useReadingDetail(readingId: string | null) {
  const [reading, setReading] = useState<Reading | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!readingId) {
      setReading(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function fetchReading() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<ApiSuccess>(
          `/readings/${readingId}`,
        )
        if (!cancelled) {
          setReading(response.data.data.reading)
        }
      } catch (err: unknown) {
        if (cancelled) {
          return
        }

        let message = 'Could not load reading details.'
        if (axios.isAxiosError(err) && err.response?.data) {
          const data = err.response.data as ApiFailure
          message = data.message || message
        }

        setReading(null)
        setError(message)
        showErrorToast(message)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchReading()

    return () => {
      cancelled = true
    }
  }, [readingId, reloadKey])

  function retry() {
    setReloadKey((current) => current + 1)
  }

  return {
    reading,
    isLoading,
    error,
    retry,
  }
}
