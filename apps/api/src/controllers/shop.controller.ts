import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { getShopCatalogForUser, purchaseShopItem } from '../services/shop.service'
import { SHOP_ERROR_CODES } from '../types/error-codes'
import { sendError, sendSuccess } from '../utils/response'

// SHT-01: 상점 상품 목록 (로그인 사용자의 보유 여부 포함)
export async function items(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string

  try {
    sendSuccess(res, await getShopCatalogForUser(userId))
  } catch (err) {
    next(err)
  }
}

// SHT-01(레벨 해금)~03(현금 결제, 데모 단계는 즉시 성공) 통합 처리
export async function purchase(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string
  const { itemId } = req.params

  try {
    const result = await purchaseShopItem(userId, itemId)

    if (result.error !== null) {
      const ERROR_CODE_MAP = {
        NOT_FOUND: SHOP_ERROR_CODES.SHOP_001,
        ALREADY_OWNED: SHOP_ERROR_CODES.SHOP_002,
        LEVEL_TOO_LOW: SHOP_ERROR_CODES.SHOP_003,
        NOT_ENOUGH_TOKEN: SHOP_ERROR_CODES.SHOP_004
      } as const
      sendError(res, 400, ERROR_CODE_MAP[result.error])
      return
    }

    sendSuccess(res, { success: true, tokenBalance: result.tokenBalance })
  } catch (err) {
    next(err)
  }
}
