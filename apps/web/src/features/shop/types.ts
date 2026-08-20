/** 상점 도메인 타입 (소유자: FE2) */
export type ShopSection = 'GENERAL' | 'TOKEN' | 'PREMIUM';

export interface ShopItem {
  id: string;
  section: ShopSection;
  name: string;
  /** GENERAL: 해금 레벨 / TOKEN: 토큰 가격 / PREMIUM: 원화 가격 */
  price: number;
  priceUnit: 'LEVEL' | 'TOKEN' | 'KRW';
  /** 로그인 사용자의 실제 구매 여부(서버 기준). mock에서는 내려오지 않음 — 로컬 inventoryStorage로 대체 중. */
  owned?: boolean;
}
