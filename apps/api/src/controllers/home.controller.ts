import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { getHomeStatus } from '../services/home.service'
import { sendSuccess } from '../utils/response'

// GET /api/home/status — HOM-01/03/04
export async function status(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string

  try {
    const result = await getHomeStatus(userId)
    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}
