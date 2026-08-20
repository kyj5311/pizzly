import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { AppScreen, BackHomeButton, Button, Card, PizzlyCharacter, ProgressBar } from '../../../shared/ui';
import { getGrowthResult } from '../api/growthApi';
import { MILESTONE_MESSAGE } from '../types';
import type { GrowthResult } from '../types';

/** FE2 담당 (GRW-01~03 화면 표시, GRW-05 이미지 저장) */
export default function GrowthPage() {
  const [result, setResult] = useState<GrowthResult | null>(null);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void getGrowthResult().then(setResult);
  }, []);

  const leveledUp = result ? result.currentLevel > result.previousLevel : false;
  const expPercent = result ? result.currentExp / result.nextLevelExp : 0;

  // GRW-05: 실제 SNS 연동 없이 카드를 이미지로 캡처해 다운로드만 지원한다.
  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = `pizzly-growth-lv${result?.currentLevel ?? ''}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen header={<BackHomeButton />} title="성장">
      <div ref={cardRef} className="mb-4">
        <Card className="flex flex-col items-center gap-3 bg-primary/5 py-8">
          <p className="font-bold text-primary-strong">경험치 획득! +{result?.gainedExp ?? 0} EXP</p>

          <PizzlyCharacter level={result?.currentLevel ?? 1} size={160} />

          <p className="text-xl font-extrabold">
            {leveledUp ? (
              <>
                피즐리 Lv.{result?.previousLevel} → Lv.{result?.currentLevel}
              </>
            ) : (
              <>피즐리 Lv.{result?.currentLevel ?? '-'}</>
            )}
          </p>

          <div className="w-full px-4">
            <ProgressBar value={expPercent} label="성장 경험치" />
            <p className="mt-1 text-center text-xs text-muted">
              {result?.currentExp ?? 0} / {result?.nextLevelExp ?? 0} EXP
            </p>
          </div>

          {result?.reachedMilestone && (
            <p className="rounded-full bg-accent/15 px-4 py-1 text-sm font-semibold text-accent-strong">
              {MILESTONE_MESSAGE[result.reachedMilestone]}
            </p>
          )}
        </Card>
      </div>

      <Button fullWidth variant="secondary" onClick={handleSaveImage} disabled={saving || !result}>
        {saving ? '저장하는 중...' : '성장 카드 이미지로 저장'}
      </Button>

      <Card className="mt-4">
        <p className="mb-2 text-sm font-bold">레벨 성장 안내</p>
        <ul className="space-y-1 text-sm text-muted">
          <li>Lv.30 달성 시 중간 크기로 성장해요</li>
          <li>Lv.60 달성 시 근육이 성장해요</li>
          <li>Lv.100 달성 시 피즐리베어로 성장해요</li>
        </ul>
        {/* GRW-04: 카피는 PM 담당, 화면 표시는 FE2 */}
        <p className="mt-3 text-xs text-muted">Lv.130 이후 콘텐츠는 추후 개발될 예정이에요.</p>
      </Card>
    </AppScreen>
  );
}
