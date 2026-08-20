export type ShopSection = 'GENERAL' | 'TOKEN' | 'PREMIUM'

export interface ShopItem {
  id: string
  section: ShopSection
  name: string
  /** GENERAL: 해금 레벨 / TOKEN: 토큰 가격 / PREMIUM: 원화 가격 */
  price: number
  priceUnit: 'LEVEL' | 'TOKEN' | 'KRW'
}

// GET /api/shop/items 응답용. 로그인한 사용자의 구매 여부를 합쳐서 내려준다.
export interface ShopItemView extends ShopItem {
  owned: boolean
}
