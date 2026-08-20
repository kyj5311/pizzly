import hatImage from '../../assets/costumes/pizzly-item-hat.png';
import scarfImage from '../../assets/costumes/pizzly-item-scarf.png';
import beretImage from '../../assets/costumes/hat.png';
import backpackImage from '../../assets/costumes/bag.png';
import crossBagImage from '../../assets/costumes/cross_bag.png';
import capeImage from '../../assets/costumes/cape.png';
import hanbokOrnamentImage from '../../assets/costumes/hanbok_ornament.png';
import gatImage from '../../assets/costumes/gat.png';
import hanbokImage from '../../assets/costumes/hanbok.png';

/** 상점(shop.mock.ts) ShopItem.id → 상품 이미지. 이미지가 없는 상품은 기존 섹션 아이콘으로 대체된다. */
export const SHOP_ITEM_IMAGES: Partial<Record<string, string>> = {
  'shop-token-hat': hatImage,
  'shop-token-scarf': scarfImage,
  'shop-token-beret': beretImage,
  'shop-gen-backpack': backpackImage,
  'shop-token-crossbag': crossBagImage,
  'shop-token-cloak': capeImage,
  'shop-premium-norigae': hanbokOrnamentImage,
  'shop-premium-gat': gatImage,
  'shop-premium-hanbok': hanbokImage,
};
