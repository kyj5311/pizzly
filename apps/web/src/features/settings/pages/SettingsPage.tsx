import { AppScreen, BackHomeButton, Card } from '../../../shared/ui';
import { PIZZLY_STAGES } from '../../../shared/ui/pizzly-stages';

/** FE2 담당. 설정 화면 — 우선 피즐리 성장 단계별 이미지 안내만 제공한다. */
export default function SettingsPage() {
  const stagesAscending = [...PIZZLY_STAGES].reverse();

  return (
    <AppScreen header={<BackHomeButton />} title="설정">
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
