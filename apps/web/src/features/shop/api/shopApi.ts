import { api, USE_MOCK } from '../../../shared/api/client';
import { mockGetShopItems, mockPurchaseItem } from '../../../mocks/shop.mock';
import type { ShopItem } from '../types';

/** SHT-01 BE1 담당(레벨 조건) / SHT-02 BE1 담당(토큰 소모) / SHT-03 BE2 담당(현금 결제) */
export async function getShopItems(): Promise<ShopItem[]> {
  if (USE_MOCK) return mockGetShopItems();
  return api.get<ShopItem[]>('/shop/items');
}

export async function purchaseItem(itemId: string): Promise<{ success: true }> {
  if (USE_MOCK) return mockPurchaseItem(itemId);
  return api.post<{ success: true }>(`/shop/items/${itemId}/purchase`);
}
