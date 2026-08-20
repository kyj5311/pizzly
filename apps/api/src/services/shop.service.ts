import { prisma } from '../utils/prisma'
import type { ShopItem, ShopItemView } from '../types/shop'

// SHT-01~03. PM 기준표에 상점 상품 목록이 아직 없어 임시로 고정 카탈로그를 코드에 박아둔다.
// FE2가 먼저 만들어둔 mocks/shop.mock.ts 카탈로그와 id/이름/가격을 동일하게 맞춤 (연동 시 화면이 그대로 유지되도록).
export const SHOP_CATALOG: ShopItem[] = [
  { id: 'shop-gen-hat', section: 'GENERAL', name: '기본 모자', price: 5, priceUnit: 'LEVEL' },
  { id: 'shop-gen-shirt', section: 'GENERAL', name: '기본 티셔츠', price: 10, priceUnit: 'LEVEL' },
  { id: 'shop-gen-cushion', section: 'GENERAL', name: '곰 쿠션', price: 15, priceUnit: 'LEVEL' },
  { id: 'shop-gen-bandana', section: 'GENERAL', name: '발바닥 반다나', price: 20, priceUnit: 'LEVEL' },
  { id: 'shop-gen-strawhat', section: 'GENERAL', name: '리본 밀짚모자', price: 25, priceUnit: 'LEVEL' },
  { id: 'shop-gen-backpack', section: 'GENERAL', name: '미니 백팩', price: 30, priceUnit: 'LEVEL' },
  { id: 'shop-token-hat', section: 'TOKEN', name: '피즐리 모자', price: 60, priceUnit: 'TOKEN' },
  { id: 'shop-token-scarf', section: 'TOKEN', name: '피즐리 스카프', price: 60, priceUnit: 'TOKEN' },
  { id: 'shop-token-costume', section: 'TOKEN', name: '희귀 코스튬', price: 150, priceUnit: 'TOKEN' },
  { id: 'shop-token-accessory', section: 'TOKEN', name: '한정 액세서리', price: 120, priceUnit: 'TOKEN' },
  { id: 'shop-token-booster', section: 'TOKEN', name: '경험치 부스터 (30분)', price: 80, priceUnit: 'TOKEN' },
  { id: 'shop-token-reset-appearance', section: 'TOKEN', name: '처음 곰으로 돌아가기', price: 50, priceUnit: 'TOKEN' },
  { id: 'shop-premium-starter', section: 'PREMIUM', name: '스타터 팩', price: 1200, priceUnit: 'KRW' },
  { id: 'shop-premium-theme', section: 'PREMIUM', name: '테마 세트', price: 5900, priceUnit: 'KRW' },
  { id: 'shop-premium-pack', section: 'PREMIUM', name: '프리미엄 팩', price: 11900, priceUnit: 'KRW' },
  // 추석 한정 한복 세트 (기간 한정)
  { id: 'shop-premium-norigae', section: 'PREMIUM', name: '추석 한정 노리개', price: 2900, priceUnit: 'KRW' },
  { id: 'shop-premium-gat', section: 'PREMIUM', name: '추석 한정 갓', price: 8900, priceUnit: 'KRW' },
  { id: 'shop-premium-hanbok', section: 'PREMIUM', name: '추석 한정 한복', price: 15900, priceUnit: 'KRW' }
]

export function getShopCatalog(): ShopItem[] {
  return SHOP_CATALOG
}

// SHT-01: 상점 화면에서 "보유중" 표시를 위해 로그인한 사용자의 구매 여부를 합쳐서 내려준다.
export async function getShopCatalogForUser(userId: string): Promise<ShopItemView[]> {
  const purchases = await prisma.shopPurchase.findMany({ where: { userId }, select: { itemId: true } })
  const ownedIds = new Set(purchases.map((purchase) => purchase.itemId))

  return SHOP_CATALOG.map((item) => ({ ...item, owned: ownedIds.has(item.id) }))
}

export type PurchaseShopItemError = 'NOT_FOUND' | 'ALREADY_OWNED' | 'LEVEL_TOO_LOW' | 'NOT_ENOUGH_TOKEN'
export type PurchaseShopItemResult = { error: PurchaseShopItemError } | { error: null; tokenBalance: number }

// KRW(PREMIUM) 상품은 실제 PG 연동이 없어 데모 단계에서는 결제 없이 즉시 성공 처리한다.
// (README 발표 방침과 동일하게 "추후 실 결제 연동 예정"으로 안내)
// 성공 시 tokenBalance(구매 후 최신 토큰 잔액)를 같이 내려줘서, 프론트가 별도 조회 없이
// 상점 화면에서 바로 잔액을 반영할 수 있게 한다.
export async function purchaseShopItem(userId: string, itemId: string): Promise<PurchaseShopItemResult> {
  const item = SHOP_CATALOG.find((candidate) => candidate.id === itemId)
  if (!item) return { error: 'NOT_FOUND' }

  const existing = await prisma.shopPurchase.findUnique({ where: { userId_itemId: { userId, itemId } } })
  if (existing) return { error: 'ALREADY_OWNED' }

  if (item.priceUnit === 'LEVEL') {
    const pizzly = await prisma.pizzly.findUniqueOrThrow({ where: { userId } })
    if (pizzly.level < item.price) return { error: 'LEVEL_TOO_LOW' }
    await prisma.shopPurchase.create({ data: { userId, itemId } })
    return { error: null, tokenBalance: pizzly.token }
  }

  if (item.priceUnit === 'TOKEN') {
    const pizzly = await prisma.pizzly.findUniqueOrThrow({ where: { userId } })
    if (pizzly.token < item.price) return { error: 'NOT_ENOUGH_TOKEN' }
    const [updated] = await prisma.$transaction([
      prisma.pizzly.update({ where: { userId }, data: { token: { decrement: item.price } } }),
      prisma.shopPurchase.create({ data: { userId, itemId, tokenSpent: item.price } })
    ])
    return { error: null, tokenBalance: updated.token }
  }

  await prisma.shopPurchase.create({ data: { userId, itemId } })
  const pizzly = await prisma.pizzly.findUniqueOrThrow({ where: { userId } })
  return { error: null, tokenBalance: pizzly.token }
}
