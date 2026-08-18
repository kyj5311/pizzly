import type { NextFunction, Response } from 'express'
import type { AuthedRequest } from '../middlewares/auth.middleware'
import { getShopCatalog, purchaseShopItem } from '../services/shop.service'
import { SHOP_ERROR_CODES } from '../types/error-codes'
import { sendError, sendSuccess } from '../utils/response'

// SHT-01: 상점 상품 목록
export async function items(_req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, getShopCatalog())
  } catch (err) {
    next(err)
  }
}

// SHT-01(레벨 해금)~03(현금 결제, 데모 단계는 즉시 성공) 통합 처리
export async function purchase(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  const userId = req.userId as string
  const { itemId } = req.params

  try {
    const error = await purchaseShopItem(userId, itemId)

    if (error === 'NOT_FOUND') {
      sendError(res, 400, SHOP_ERROR_CODES.SHOP_001)
      return
    }
    if (error === 'ALREADY_OWNED') {
      sendError(res, 400, SHOP_ERROR_CODES.SHOP_002)
      return
    }
    if (error === 'LEVEL_TOO_LOW') {
      sendError(res, 400, SHOP_ERROR_CODES.SHOP_003)
      return
    }
    if (error === 'NOT_ENOUGH_TOKEN') {
      sendError(res, 400, SHOP_ERROR_CODES.SHOP_004)
      return
    }

    sendSuccess(res, { success: true })
  } catch (err) {
    next(err)
  }
}
