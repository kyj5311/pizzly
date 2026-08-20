import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { getPassStatus, purchasePass } from '../services/pass.service'
import { PASS_ERROR_CODES } from '../types/error-codes'
import { sendError, sendSuccess } from '../utils/response'

// PAS-01/04: 패스 상태 + 진행도
export async function status(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string

  try {
    const result = await getPassStatus(userId)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}

// PAS-02: 패스 구매
export async function purchase(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string

  try {
    const error = await purchasePass(userId)

    if (error === 'ALREADY_ACTIVE') {
      sendError(res, 400, PASS_ERROR_CODES.PASS_002)
      return
    }
    if (error === 'NOT_ENOUGH_TOKEN') {
      sendError(res, 400, PASS_ERROR_CODES.PASS_001)
      return
    }

    sendSuccess(res, { success: true })
  } catch (err) {
    next(err)
  }
}
