import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppScreen, BackHomeButton, Button, Card, PizzlyCharacter } from '../../../shared/ui';
import { COSTUME_ITEMS } from '../../../shared/ui/costume-items';
import { PIZZLY_STAGES } from '../../../shared/ui/pizzly-stages';
import { costumeStorage } from '../../../utils/costume-storage';
import { inventoryStorage } from '../../../utils/inventory-storage';

/** FE2 담당. 설정 화면 — 성장 단계 안내 + 코스튬 장착. */
export default function SettingsPage() {
  const stagesAscending = [...PIZZLY_STAGES].reverse();
  const [equipped, setEquipped] = useState(() => costumeStorage.getEquipped());
  const [owned] = useState(() => inventoryStorage.getOwned());

  const handleToggle = (id: (typeof COSTUME_ITEMS)[number]['id']) => {
    costumeStorage.toggle(id);
    setEquipped(costumeStorage.getEquipped());
  };

  const ownedCostumes = COSTUME_ITEMS.filter((item) => owned.includes(item.shopItemId));

  return (
    <AppScreen header={<BackHomeButton />} title="설정">
      <section className="mb-6">
        <h2 className="mb-1 text-base font-bold">코스튬</h2>
        <p className="mb-3 text-xs text-muted">아기 곰 단계에서 착용한 모습을 볼 수 있어요.</p>

        <Card className="mb-3 flex items-center justify-center py-4">
          <PizzlyCharacter level={1} size={140} />
        </Card>

        {ownedCostumes.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-6 text-center">
            <p className="text-sm text-muted">아직 보유한 코스튬이 없어요.</p>
            <Link to="/shop" className="text-sm font-semibold text-primary active:opacity-70">
              상점에서 구매하러 가기 →
            </Link>
          </Card>
        ) : (
          <div className="space-y-2">
            {ownedCostumes.map((item) => {
              const isOn = equipped.includes(item.id);
              return (
                <Card key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} width={40} height={40} className="h-10 w-10 object-contain" />
                    <p className="font-semibold">{item.name}</p>
                  </div>
                  <Button variant={isOn ? 'primary' : 'secondary'} onClick={() => handleToggle(item.id)}>
                    {isOn ? '착용 중' : '착용하기'}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-base font-bold">피즐리 성장 단계</h2>
        <p className="mb-3 text-xs text-muted">레벨에 따라 피즐리의 모습이 이렇게 달라져요.</p>

        <div className="space-y-3">
          {stagesAscending.map((stage) => (
            <Card key={stage.minLevel} className="flex items-center gap-3">
              <img
                src={stage.image}
                alt={stage.name}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="whitespace-nowrap rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    Lv.{stage.minLevel}
                  </span>
                  <p className="truncate font-semibold">{stage.name}</p>
                </div>
                <p className="mt-1 text-xs text-muted">{stage.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </AppScreen>
  );
}
