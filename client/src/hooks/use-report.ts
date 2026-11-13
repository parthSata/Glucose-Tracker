import axios from 'axios'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { todayDateOnlyLocal } from '@/lib/date-only'
import { reportDateFormSchema } from '@/lib/date-schemas'
import type {
  DailyReport,
  MonthToDateReport,
  ReportKind,
  ReportSummaryData,
} from '@/types/report'

type ApiSuccess<T> = {
  success: true
  message: string
  data: T
}

type ApiFailure = {
  success: false
  message: string
  errors?: Record<string, string[] | undefined>
}

const REPORT_PATH: Record<ReportKind, string> = {
  daily: '/reports/daily',
  'month-to-date': '/reports/month-to-date',
}

const REPORT_LOAD_ERROR: Record<ReportKind, string> = {
  daily: 'Could not load daily report.',
  'month-to-date': 'Could not load month-to-date report.',
}

export function useReport(kind: ReportKind) {
  const [selectedDate, setSelectedDateState] = useState(todayDateOnlyLocal)
  const [dateError, setDateError] = useState<string | null>(null)
  const [report, setReport] = useState<ReportSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  function setSelectedDate(nextDate: string) {
    const parsed = reportDateFormSchema.safeParse({ date: nextDate })
    if (!parsed.success) {
      const message =
        parsed.error.flatten().fieldErrors.date?.[0] ??
        parsed.error.issues[0]?.message ??
        'Please select a valid date.'
      setDateError(message)
      setSelectedDateState(nextDate)
      return
    }

    setDateError(null)
    setSelectedDateState(parsed.data.date)
  }

  useEffect(() => {
    const parsed = reportDateFormSchema.safeParse({ date: selectedDate })
    if (!parsed.success) {
      setIsLoading(false)
      setReport(null)
      setError(null)
      return
    }

    const dateToFetch = parsed.data.date
    let cancelled = false

    async function fetchReport() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get<
          ApiSuccess<DailyReport | MonthToDateReport>
        >(REPORT_PATH[kind], {
          params: { date: dateToFetch },
        })
        if (!cancelled) {
          setReport(response.data.data)
        }
      } catch (err: unknown) {
        if (cancelled) {
          return
        }

        if (axios.isAxiosError(err) && err.response?.data) {
          const data = err.response.data as ApiFailure
          const fieldMessage = data.errors?.date?.[0]
          if (fieldMessage) {
            setDateError(fieldMessage)
          }
          setError(data.message || REPORT_LOAD_ERROR[kind])
        } else {
          setError(`${REPORT_LOAD_ERROR[kind]} Please try again.`)
        }
        setReport(null)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchReport()

    return () => {
      cancelled = true
    }
  }, [kind, selectedDate, reloadKey])

  function refetch() {
    setReloadKey((current) => current + 1)
  }

  return {
    selectedDate,
    setSelectedDate,
    dateError,
    maxDate: todayDateOnlyLocal(),
    report,
    isLoading,
    error,
    refetch,
  }
}
