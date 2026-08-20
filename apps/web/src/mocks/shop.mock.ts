import type { ShopItem } from '../features/shop/types';

/** FE2 소유. BE1/BE2 연동 전까지 상점 화면을 끝까지 돌리기 위한 데이터. */
const ITEMS: ShopItem[] = [
  { id: 'shop-gen-hat', section: 'GENERAL', name: '기본 모자', price: 5, priceUnit: 'LEVEL' },
  { id: 'shop-gen-shirt', section: 'GENERAL', name: '기본 티셔츠', price: 10, priceUnit: 'LEVEL' },
  { id: 'shop-gen-cushion', section: 'GENERAL', name: '곰 쿠션', price: 15, priceUnit: 'LEVEL' },
  { id: 'shop-gen-bandana', section: 'GENERAL', name: '반다나', price: 20, priceUnit: 'LEVEL' },
  { id: 'shop-gen-strawhat', section: 'GENERAL', name: '밀짚모자', price: 25, priceUnit: 'LEVEL' },
  { id: 'shop-gen-backpack', section: 'GENERAL', name: '백팩', price: 30, priceUnit: 'LEVEL' },
  { id: 'shop-token-hat', section: 'TOKEN', name: '피즐리 모자', price: 60, priceUnit: 'TOKEN' },
  { id: 'shop-token-scarf', section: 'TOKEN', name: '피즐리 스카프', price: 60, priceUnit: 'TOKEN' },
  { id: 'shop-token-beret', section: 'TOKEN', name: '보라 베레모', price: 60, priceUnit: 'TOKEN' },
  { id: 'shop-token-crossbag', section: 'TOKEN', name: '크로스백', price: 90, priceUnit: 'TOKEN' },
  { id: 'shop-token-cloak', section: 'TOKEN', name: '초록 망토', price: 120, priceUnit: 'TOKEN' },
  { id: 'shop-token-costume', section: 'TOKEN', name: '희귀 코스튬', price: 150, priceUnit: 'TOKEN' },
  { id: 'shop-token-accessory', section: 'TOKEN', name: '한정 액세서리', price: 120, priceUnit: 'TOKEN' },
  { id: 'shop-token-booster', section: 'TOKEN', name: '경험치 부스터 (30분)', price: 80, priceUnit: 'TOKEN' },
  { id: 'shop-token-reset-appearance', section: 'TOKEN', name: '처음 곰으로 돌아가기', price: 50, priceUnit: 'TOKEN' },
  { id: 'shop-premium-starter', section: 'PREMIUM', name: '스타터 팩', price: 1200, priceUnit: 'KRW' },
  { id: 'shop-premium-theme', section: 'PREMIUM', name: '테마 세트', price: 5900, priceUnit: 'KRW' },
  { id: 'shop-premium-pack', section: 'PREMIUM', name: '프리미엄 팩', price: 11900, priceUnit: 'KRW' },
  { id: 'shop-premium-norigae', section: 'PREMIUM', name: '한복 장식', price: 2900, priceUnit: 'KRW' },
  { id: 'shop-premium-gat', section: 'PREMIUM', name: '갓', price: 8900, priceUnit: 'KRW' },
  { id: 'shop-premium-hanbok', section: 'PREMIUM', name: '한복 기본', price: 15900, priceUnit: 'KRW' },
];

export async function mockGetShopItems(): Promise<ShopItem[]> {
  await new Promise((r) => setTimeout(r, 150));
  return ITEMS;
}

export async function mockPurchaseItem(_itemId: string): Promise<{ success: true }> {
  await new Promise((r) => setTimeout(r, 200));
  return { success: true };
}
