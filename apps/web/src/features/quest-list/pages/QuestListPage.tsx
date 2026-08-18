import { useEffect, useState } from 'react';
import { AppScreen, BackHomeButton, Card } from '../../../shared/ui';
import { cn } from '../../../shared/lib/cn';
import { getQuestList, setQuestSaved } from '../api/questListApi';
import type { QuestListArea, QuestListItem, QuestListTab } from '../types';

const TABS: { key: QuestListTab; label: string }[] = [
  { key: 'RECOMMENDED', label: '추천' },
  { key: 'CATEGORY', label: '카테고리' },
  { key: 'SAVED', label: '보관함' },
];

const AREA_LABEL: Record<QuestListArea, string> = {
  EYE: '눈 피로',
  WRIST: '손목·손가락',
  NECK_SHOULDER: '목·어깨',
  REST: '휴식',
};

const AREA_ORDER: QuestListArea[] = ['EYE', 'WRIST', 'NECK_SHOULDER', 'REST'];

/** FE2 담당 — 19번 화면(퀘스트 목록). FE1의 QST-01~07 추천 흐름과 별개의 둘러보기 카탈로그. */
export default function QuestListPage() {
  const [items, setItems] = useState<QuestListItem[]>([]);
  const [tab, setTab] = useState<QuestListTab>('RECOMMENDED');

  useEffect(() => {
    void getQuestList().then(setItems);
  }, []);

  const toggleSaved = (id: string) => {
    const next = !items.find((item) => item.id === id)?.saved;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, saved: next } : item)));
    void setQuestSaved(id, next).catch(() => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, saved: !next } : item)));
    });
  };

  return (
    <AppScreen header={<BackHomeButton />} title="퀘스트 목록">
      <div className="mb-3 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 rounded-button py-2 text-sm font-semibold transition',
              tab === t.key ? 'bg-primary text-white' : 'border border-border bg-surface text-muted',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'CATEGORY' ? (
        <div className="space-y-4">
          {AREA_ORDER.map((area) => {
            const areaItems = items.filter((item) => item.area === area);
            if (!areaItems.length) return null;
            return (
              <div key={area}>
                <p className="mb-2 text-sm font-bold">{AREA_LABEL[area]}</p>
                <div className="space-y-2">
                  {areaItems.map((item) => (
                    <QuestRow key={item.id} item={item} onToggleSaved={toggleSaved} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {(tab === 'SAVED' ? items.filter((i) => i.saved) : items).map((item) => (
            <QuestRow key={item.id} item={item} onToggleSaved={toggleSaved} />
          ))}
          {tab === 'SAVED' && items.filter((i) => i.saved).length === 0 && (
            <p className="py-8 text-center text-sm text-muted">아직 보관한 퀘스트가 없어요</p>
          )}
        </div>
      )}
    </AppScreen>
  );
}

function QuestRow({ item, onToggleSaved }: { item: QuestListItem; onToggleSaved: (id: string) => void }) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-semibold">{item.title}</p>
        <p className="text-xs text-muted">
          {item.durationMin}분 · {item.detail}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onToggleSaved(item.id)}
        aria-pressed={item.saved}
        aria-label={item.saved ? '보관함에서 제거' : '보관함에 저장'}
        className={cn('shrink-0 text-2xl', item.saved ? 'text-primary' : 'text-border')}
      >
        {item.saved ? '♥' : '♡'}
      </button>
    </Card>
  );
}
