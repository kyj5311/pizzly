import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { getLatestGrowthResult, setDevLevel } from '../services/growth.service'
import { GROWTH_ERROR_CODES } from '../types/error-codes'
import { sendError, sendSuccess } from '../utils/response'

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

// 설정 화면 "개발자 모드" 전용. 레벨 게이트(상점 해금·성장 단계) QA용으로 레벨을 직접 지정한다.
export async function devSetLevel(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string
  const { level, exp } = req.body

  if (!Number.isInteger(level) || level < 1) {
    sendError(res, 400, GROWTH_ERROR_CODES.GROWTH_003)
    return
  }
  if (exp !== undefined && (!Number.isInteger(exp) || exp < 0)) {
    sendError(res, 400, GROWTH_ERROR_CODES.GROWTH_002)
    return
  }

  try {
    const result = await setDevLevel(userId, level, exp)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}
