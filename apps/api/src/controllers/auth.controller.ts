import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

/**
  [LOG-01] 테스트 계정 로그인 (소셜 로그인 대체)
 **/
export async function loginTestUser(req: Request, res: Response): Promise<void> {
  try {
    // 테스트용 기본 유저가 없으면 자동 생성
    let user = await prisma.user.findUnique({
      where: { email: 'test_pizzly@groom.aa' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test_pizzly@groom.aa',
          name: '피즐리 테스터',
          pizzly: {
            create: { level: 1, exp: 0, token: 10, growthStage: 1 },
          },
        },
      });
    }

    res.status(200).json(
      sendSuccess({
        token: 'test-token-1',
        userId: user.id,
        email: user.email,
        name: user.name,
      })
    );
  } catch (error) {
    res.status(500).json(sendError('AUTH_003', '테스트 로그인 처리 중 오류가 발생했습니다.'));
  }
}

/**
 [ONB-01, ONB-02] 관심 활동 및 제한사항 저장
 **/
export async function saveOnboarding(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { interests, restrictions } = req.body;

    if (!userId) {
      res.status(401).json(sendError('AUTH_004', '권한이 없습니다.'));
      return;
    }

    // 기존 온보딩 정보가 있으면 업데이트, 없으면 생성 (Upsert)
    const onboarding = await prisma.onboarding.upsert({
      where: { userId },
      update: { interests, restrictions },
      create: {
        userId,
        interests,
        restrictions,
      },
    });

    res.status(200).json(sendSuccess(onboarding));
  } catch (error) {
    res.status(500).json(sendError('ONB_001', '온보딩 정보 저장 중 오류가 발생했습니다.'));
  }
}