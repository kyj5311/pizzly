import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { recommendQuests } from '../services/quest.service'
import { completeQuestAndGrantRewards } from '../services/reward.service'
import { prisma } from '../utils/prisma'
import { sendError, sendSuccess } from '../utils/response'
import { QUEST_ERROR_CODES } from '../types/error-codes'
import type { QuestCondition, QuestDurationMinutes, QuestSituation } from '../types/quest'

const VALID_DURATIONS: QuestDurationMinutes[] = [1, 3, 5]
const VALID_SITUATIONS: QuestSituation[] = ['SITTING', 'STANDING', 'MOVING', 'QUIET_PLACE']
const VALID_CONDITIONS: QuestCondition[] = ['EYE_FATIGUE', 'WRIST_FINGER', 'NECK_SHOULDER', 'REST']

export async function recommend(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { duration, situation, condition } = req.body

  if (
    !VALID_DURATIONS.includes(duration) ||
    !VALID_SITUATIONS.includes(situation) ||
    !VALID_CONDITIONS.includes(condition)
  ) {
    sendError(res, 400, QUEST_ERROR_CODES.QUEST_002)
    return
  }

  const userId = req.userId as string

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { onboarding: true } })
    const restrictions = (user?.onboarding?.restrictions as string[] | null) ?? []

    const quests = await recommendQuests(userId, { duration, situation, condition }, restrictions)

    if (quests.length === 0) {
      sendError(res, 400, QUEST_ERROR_CODES.QUEST_001)
      return
    }

    sendSuccess(res, { quests })
  } catch (err) {
    next(err)
  }
}

// QST-07: 퀘스트 완료. 완료 로그 생성 + 보상 지급(REW-01~04) + 성장 반영(GRW-01/02)
export async function complete(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string
  const { questId, elapsedSeconds } = req.body

  if (typeof questId !== 'string' || questId.length === 0) {
    sendError(res, 400, QUEST_ERROR_CODES.QUEST_003)
    return
  }
  if (!Number.isInteger(elapsedSeconds) || elapsedSeconds < 0) {
    sendError(res, 400, QUEST_ERROR_CODES.QUEST_005)
    return
  }

  try {
    const quest = await prisma.quest.findUnique({ where: { id: questId } })
    if (!quest) {
      sendError(res, 400, QUEST_ERROR_CODES.QUEST_003)
      return
    }

    const questLog = await prisma.questLog.create({ data: { userId, questId, elapsedSeconds } })
    const result = await completeQuestAndGrantRewards(userId, questLog.id, quest.duration)

    sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}
