import hatImage from '../../assets/costumes/pizzly-item-hat.png';
import scarfImage from '../../assets/costumes/pizzly-item-scarf.png';

export type CostumeItemId = 'hat' | 'scarf';

export interface CostumeItem {
  id: CostumeItemId;
  /** 상점(shop.mock.ts)의 ShopItem.id — 이 아이템을 사야 설정에서 착용할 수 있다. */
  shopItemId: string;
  name: string;
  image: string;
  /** pizzly-base(480x480) 캔버스 기준 위치·크기 비율(0~1). 아기 곰 포즈에서 잘라낸 것이라 이 단계에서만 정확히 맞는다. */
  rect: { left: number; top: number; width: number; height: number };
}

/** pizzly-main.png(모자+스카프 착용 버전)에서 아기 곰 몸통과의 차이만 잘라낸 코스튬. */
export const COSTUME_ITEMS: CostumeItem[] = [
  {
    id: 'hat',
    shopItemId: 'shop-token-hat',
    name: '피즐리 모자',
    image: hatImage,
    rect: { left: 215 / 480, top: 51 / 480, width: 138 / 480, height: 107 / 480 },
  },
  {
    id: 'scarf',
    shopItemId: 'shop-token-scarf',
    name: '피즐리 스카프',
    image: scarfImage,
    rect: { left: 158 / 480, top: 282 / 480, width: 161 / 480, height: 98 / 480 },
  },
];
