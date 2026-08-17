import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

// Express Request 타입 확장 (req.user에 userId 추가)
export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(sendError('AUTH_001', '인증 토큰이 존재하지 않습니다.'));
    return;
  }

  const token = authHeader.split(' ')[1];

  // 해커톤 데모용 간소화된 테스트 계정 검증
  if (token === 'test-token-1') {
    req.userId = 1; // 고정된 테스트 유저 ID 할당
    next();
    return;
  }

  res.status(401).json(sendError('AUTH_002', '유효하지 않은 테스트 토큰입니다.'));
}