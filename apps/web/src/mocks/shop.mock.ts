import type { ShopItem } from '../features/shop/types';

/** FE2 소유. BE1/BE2 연동 전까지 상점 화면을 끝까지 돌리기 위한 데이터. */
const ITEMS: ShopItem[] = [
  { id: 'shop-gen-bandana', section: 'GENERAL', name: '반다나', price: 3, priceUnit: 'LEVEL' },
  { id: 'shop-gen-strawhat', section: 'GENERAL', name: '밀짚모자', price: 8, priceUnit: 'LEVEL' },
  { id: 'shop-token-booster', section: 'TOKEN', name: '경험치 부스터 (30분)', price: 80, priceUnit: 'TOKEN' },
  { id: 'shop-token-reset-appearance', section: 'TOKEN', name: '처음 곰으로 돌아가기', price: 50, priceUnit: 'TOKEN' },
  { id: 'shop-premium-starter', section: 'PREMIUM', name: '스타터 팩', price: 1200, priceUnit: 'KRW' },
  { id: 'shop-premium-theme', section: 'PREMIUM', name: '테마 세트', price: 5900, priceUnit: 'KRW' },
  { id: 'shop-premium-pack', section: 'PREMIUM', name: '프리미엄 팩', price: 11900, priceUnit: 'KRW' },
];

export async function mockGetShopItems(): Promise<ShopItem[]> {
  await new Promise((r) => setTimeout(r, 150));
  return ITEMS;
}

export async function mockPurchaseItem(_itemId: string): Promise<{ success: true }> {
  await new Promise((r) => setTimeout(r, 200));
  return { success: true };
}
