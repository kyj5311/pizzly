import { useEffect, useState } from 'react';
import { AppScreen, BackHomeButton, Button, Card, Icon } from '../../../shared/ui';
import type { IconName } from '../../../shared/ui';
import { cn } from '../../../shared/lib/cn';
import { ApiError } from '../../../shared/api/types';
import { appearanceStorage } from '../../../utils/appearance-storage';
import { inventoryStorage } from '../../../utils/inventory-storage';
import { COSTUME_ITEMS } from '../../../shared/ui/costume-items';
import { getShopItems, purchaseItem } from '../api/shopApi';
import type { ShopItem, ShopSection } from '../types';

const RESET_APPEARANCE_ITEM_ID = 'shop-token-reset-appearance';
const COSTUME_SHOP_ITEM_IDS = new Set(COSTUME_ITEMS.map((c) => c.shopItemId));

const SECTIONS: { key: ShopSection; label: string; desc: string; icon: IconName }[] = [
  { key: 'GENERAL', label: '일반 상품', desc: '레벨·경험치 조건 달성 시 해금돼요', icon: 'shop' },
  { key: 'TOKEN', label: '토큰 상점', desc: '토큰을 사용해 특별한 상품을 만나보세요', icon: 'token' },
  { key: 'PREMIUM', label: '프리미엄', desc: '현금으로 고급 상품을 구매할 수 있어요', icon: 'flag' },
];

/** FE2 담당 (SHT-01~03, 전부 P1) */
export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [section, setSection] = useState<ShopSection>('GENERAL');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resetToBase, setResetToBase] = useState(() => appearanceStorage.isResetToBase());
  const [owned, setOwned] = useState<string[]>(() => inventoryStorage.getOwned());

  useEffect(() => {
    void getShopItems().then(setItems);
  }, []);

  const current = SECTIONS.find((s) => s.key === section)!;
  const visible = items.filter((i) => i.section === section);

  const handlePurchase = async (item: ShopItem) => {
    setPurchasingId(item.id);
    setError(null);
    setMessage(null);
    try {
      await purchaseItem(item.id);
      inventoryStorage.markOwned(item.id);
      setOwned(inventoryStorage.getOwned());
      if (item.id === RESET_APPEARANCE_ITEM_ID) {
        appearanceStorage.setResetToBase(true);
        setResetToBase(true);
        setMessage('피즐리가 아기 곰으로 돌아갔어요!');
      } else if (COSTUME_SHOP_ITEM_IDS.has(item.id)) {
        setMessage(`${item.name}을(를) 구매했어요! 설정에서 착용해 보세요.`);
      } else {
        setMessage(`${item.name}을(를) 구매했어요!`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '구매에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <AppScreen header={<BackHomeButton />} title="상점">
      <div className="mb-3 flex gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSection(s.key)}
            className={cn(
              'flex-1 rounded-button py-2 text-sm font-semibold transition',
              section === s.key ? 'bg-primary text-white' : 'border border-border bg-surface text-muted',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mb-3 text-xs text-muted">{current.desc}</p>
      {error && <p className="mb-3 text-sm text-danger">{error}</p>}
      {message && <p className="mb-3 text-sm text-accent-strong">{message}</p>}

      <div className="space-y-3">
        {visible.map((item) => {
          const isResetItem = item.id === RESET_APPEARANCE_ITEM_ID;
          const alreadyApplied = isResetItem && resetToBase;
          const isOwned = owned.includes(item.id);
          const locked = alreadyApplied || (isOwned && !isResetItem);
          return (
            <Card key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Icon name={current.icon} size={48} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="whitespace-nowrap text-xs text-muted">{priceLabel(item)}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="shrink-0 whitespace-nowrap"
                disabled={purchasingId === item.id || item.priceUnit === 'LEVEL' || locked}
                onClick={() => void handlePurchase(item)}
              >
                {alreadyApplied
                  ? '적용됨'
                  : isOwned
                    ? '보유중'
                    : item.priceUnit === 'LEVEL'
                      ? '해금 대기'
                      : purchasingId === item.id
                        ? '구매 중'
                        : '구매'}
              </Button>
            </Card>
          );
        })}
      </div>
    </AppScreen>
  );
}

function priceLabel(item: ShopItem): string {
  if (item.priceUnit === 'LEVEL') return `Lv.${item.price} 해금`;
  if (item.priceUnit === 'TOKEN') return `토큰 ${item.price}`;
  return `₩${item.price.toLocaleString()}`;
}
