import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { prisma } from '../utils/prisma'
import { sendSuccess } from '../utils/response'

// LOG-01: 사전 준비된 테스트 계정으로 로그인. 없으면 최초 1회 생성.
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const testAccountId = process.env.TEST_ACCOUNT_ID ?? 'test-user'

    let user = await prisma.user.findUnique({ where: { testAccountId } })
    if (!user) {
      user = await prisma.user.create({ data: { testAccountId, nickname: '피즐리 테스터' } })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? '', { expiresIn: '7d' })

    sendSuccess(res, {
      token,
      userId: user.id,
      email: user.testAccountId,
      name: user.nickname
    })
  } catch (err) {
    next(err)
  }
}

// ONB-01/02: 관심영역·제한사항 저장 + ONB-03: 최초 저장 시점에 피즐리 캐릭터 생성
export async function saveOnboarding(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string
  const { interests, restrictions } = req.body

  try {
    const onboarding = await prisma.onboarding.upsert({
      where: { userId },
      update: { interests, restrictions },
      create: { userId, interests, restrictions }
    })

    await prisma.pizzly.upsert({
      where: { userId },
      update: {},
      create: { userId, level: 1, exp: 0, growthStage: 1, token: 0 }
    })

    sendSuccess(res, onboarding)
  } catch (err) {
    next(err)
  }
}
