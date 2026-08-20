import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { sendError } from '../utils/response'

export interface AuthedRequest extends Request {
  userId?: string
}

// 최소 동작 초안. 토큰 발급 방식은 BE1(로그인) 소관이므로
// payload 형태가 확정되면 이 미들웨어도 맞춰서 조정 필요.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization

  if (header == null || !header.startsWith('Bearer ')) {
    sendError(res, 401, { code: 'AUTH_001', message: '인증 토큰이 필요합니다.' })
    return
  }

  const token = header.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? '') as { userId: string }
    req.userId = payload.userId
    next()
  } catch {
    sendError(res, 401, { code: 'AUTH_001', message: '유효하지 않은 토큰입니다.' })
  }
}
