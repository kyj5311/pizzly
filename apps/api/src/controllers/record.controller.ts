import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { getBoxRecords, getRecordSummary, getTodayRecords, getTokenRecords } from '../services/record.service'
import { sendSuccess } from '../utils/response'

export async function today(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const records = await getTodayRecords(req.userId as string)
    sendSuccess(res, { records })
  } catch (err) {
    next(err)
  }
}

export async function summary(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await getRecordSummary(req.userId as string)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}

export async function boxes(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const records = await getBoxRecords(req.userId as string)
    sendSuccess(res, { records })
  } catch (err) {
    next(err)
  }
}

export async function tokens(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const records = await getTokenRecords(req.userId as string)
    sendSuccess(res, { records })
  } catch (err) {
    next(err)
  }
}
