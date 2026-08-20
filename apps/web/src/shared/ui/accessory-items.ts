import bandanaImg from '../../assets/costumes/accessories/bandana.png';
import strawHatImg from '../../assets/costumes/accessories/hat.png';

export interface AccessoryRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface AccessoryStageRects {
  1: AccessoryRect;
  30: AccessoryRect;
  60: AccessoryRect;
  100: AccessoryRect;
}

export interface AccessoryItem {
  id: string;
  /** 상점(shop.mock.ts)의 ShopItem.id — 이 아이템을 사야 설정에서 착용할 수 있다. */
  shopItemId: string;
  name: string;
  image: string;
  /** 성장 단계별 pizzly-base 계열 캔버스 기준 위치·크기 비율(0~1). 여러 개 동시 착용 가능. */
  rects: AccessoryStageRects;
}

/** 기본 곰 위에 겹쳐 입는 액세서리들. */
export const ACCESSORY_ITEMS: AccessoryItem[] = [
  {
    id: 'bandana',
    shopItemId: 'shop-gen-bandana',
    name: '반다나',
    image: bandanaImg,
    // pizzly_image.png(아기 곰 전용 사진)에서 직접 뽑은 것이라 1단계 위치만 정확하고,
    // 다른 단계는 같은 비율을 그대로 재사용한 근사치다.
    rects: {
      1: { left: 0.3381, top: 0.5973, width: 0.319, height: 0.1802 },
      30: { left: 0.3381, top: 0.5973, width: 0.319, height: 0.1802 },
      60: { left: 0.3381, top: 0.5973, width: 0.319, height: 0.1802 },
      100: { left: 0.3381, top: 0.5973, width: 0.319, height: 0.1802 },
    },
  },
  {
    id: 'straw-hat',
    shopItemId: 'shop-gen-strawhat',
    name: '밀짚모자',
    image: strawHatImg,
    // pizzly-base.png(480x480)와 픽셀 정렬된 원본에서 diff로 뽑아 위치가 정확하다(215,51,138,107 / 480).
    // 다른 단계는 같은 비율을 그대로 재사용한 근사치다.
    rects: {
      1: { left: 0.4479, top: 0.1063, width: 0.2875, height: 0.2229 },
      30: { left: 0.4479, top: 0.1063, width: 0.2875, height: 0.2229 },
      60: { left: 0.4479, top: 0.1063, width: 0.2875, height: 0.2229 },
      100: { left: 0.4479, top: 0.1063, width: 0.2875, height: 0.2229 },
    },
  },
];

export function getAccessoryByShopItemId(shopItemId: string): AccessoryItem | undefined {
  return ACCESSORY_ITEMS.find((a) => a.shopItemId === shopItemId);
}
