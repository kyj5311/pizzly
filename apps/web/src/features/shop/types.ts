/** 상점 도메인 타입 (소유자: FE2) */
export type ShopSection = 'GENERAL' | 'TOKEN' | 'PREMIUM';

export interface ShopItem {
  id: string;
  section: ShopSection;
  name: string;
  /** GENERAL: 해금 레벨 / TOKEN: 토큰 가격 / PREMIUM: 원화 가격 */
  price: number;
  priceUnit: 'LEVEL' | 'TOKEN' | 'KRW';
}
