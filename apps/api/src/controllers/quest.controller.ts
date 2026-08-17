import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

/**
 * [QUEST-01] 퀘스트 완료 및 경험치/토큰 보상 지급
 */
export async function completeQuest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { questId } = req.body;

    if (!userId) {
      res.status(401).json(sendError('AUTH_004', '권한이 없습니다.'));
      return;
    }

    // 1. 퀘스트 로그 기록 생성
    await prisma.questLog.create({
      data: { userId, questId },
    });

    // 2. 유저의 피즐리(캐릭터) 정보 조회
    const pizzly = await prisma.pizzly.findUnique({
      where: { userId },
    });

    if (!pizzly) {
      res.status(404).json(sendError('QUEST_001', '캐릭터 정보를 찾을 수 없습니다.'));
      return;
    }

    // 3. 경험치 및 토큰 보상 산정 (예: 완료 시 경험치 20, 토큰 1개 지급)
    const addedExp = 20;
    const addedToken = 1;
    let newExp = pizzly.exp + addedExp;
    let newLevel = pizzly.level;

    // 레벨업 로직 (예: 경험치 100 도달 시 레벨업)
    if (newExp >= 100) {
      newLevel += 1;
      newExp -= 100;
    }

    // 4. 캐릭터 정보 업데이트
    const updatedPizzly = await prisma.pizzly.update({
      where: { userId },
      data: {
        exp: newExp,
        level: newLevel,
        token: pizzly.token + addedToken,
      },
    });

    res.status(200).json(
      sendSuccess({
        pizzly: updatedPizzly,
        reward: { exp: addedExp, token: addedToken },
      }, '퀘스트가 완료되었습니다!')
    );
  } catch (error) {
    res.status(500).json(sendError('QUEST_002', '퀘스트 완료 처리 중 오류가 발생했습니다.'));
  }
}