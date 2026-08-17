import { Router } from 'express';
import { loginTestUser, saveOnboarding } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// 테스트 로그인 (소셜 로그인 불필요)
router.post('/login', loginTestUser);

// 온보딩 저장 (인증 미들웨어 적용)
router.post('/onboarding', authMiddleware as any, saveOnboarding);

export default router;