import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { recommendQuests } from '../services/quest.service'
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
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const restrictions = (user?.restrictions as string[] | null) ?? []

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
