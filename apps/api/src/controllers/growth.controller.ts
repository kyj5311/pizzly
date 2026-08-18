import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { getLatestGrowthResult } from '../services/growth.service'
import { sendSuccess } from '../utils/response'

// GET /api/growth/latest — GRW-03 성장 축하 화면
export async function latest(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string

  try {
    const result = await getLatestGrowthResult(userId)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}
