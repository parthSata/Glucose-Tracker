import axios from 'axios'
import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

type ApiSuccess = {
  success: true
  message: string
  data: null
}

type ApiFailure = {
  success: false
  message: string
}

type UseDeleteReadingOptions = {
  onSuccess?: (message: string) => void
}

export function useDeleteReading(options: UseDeleteReadingOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteReading(readingId: string) {
    setIsDeleting(true)

    try {
      const response = await apiClient.delete<ApiSuccess>(
        `/readings/${readingId}`,
      )
      const message =
        response.data.message || 'Reading deleted successfully.'
      showSuccessToast(message)
      options.onSuccess?.(message)
      return true
    } catch (error: unknown) {
      let message = 'Could not delete reading. Please try again.'
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as ApiFailure
        message = data.message || message
      }
      showErrorToast(message)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    deleteReading,
  }
}
