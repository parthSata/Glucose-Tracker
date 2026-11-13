import type { Request, Response } from 'express'
import {
  getDailyReportForUser,
  getMonthToDateReportForUser,
    getMonthlyReportForUser,
} from '@/services/report.service'
import type { ReportDateQuery } from '@/validators/report.validators'
import { requireAuthUser } from '@/utils/require-auth-user'
import { ApiResponse } from '@/utils/api-response'

export async function getDailyReport(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = requireAuthUser(req)
  const { date } = req.query as unknown as ReportDateQuery
  const report = await getDailyReportForUser(authUser.id, date)

  res
    .status(200)
    .json(
      new ApiResponse(200, report, 'Daily report retrieved successfully.'),
    )
}

export async function getMonthToDateReport(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = requireAuthUser(req)
  const { date } = req.query as unknown as ReportDateQuery
  const report = await getMonthToDateReportForUser(authUser.id, date)

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        report,
        'Month-to-date report retrieved successfully.',
      ),
    )
}

export async function getMonthlyReport(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = requireAuthUser(req)
  const { date } = req.query as unknown as ReportDateQuery
  const report = await getMonthlyReportForUser(authUser.id, date)

  res
    .status(200)
    .json(
      new ApiResponse(200, report, 'Monthly report retrieved successfully.'),
    )
}
