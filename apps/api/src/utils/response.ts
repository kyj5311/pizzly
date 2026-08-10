import type { Response } from 'express'

interface ErrorPayload {
  code: string
  message: string
}

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data, error: null })
}

export function sendError(res: Response, status: number, error: ErrorPayload): void {
  res.status(status).json({ success: false, data: null, error })
}
