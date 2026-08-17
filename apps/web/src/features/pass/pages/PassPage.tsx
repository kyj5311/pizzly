import { useEffect, useState } from 'react';
import { AppScreen, BackHomeButton, Button, Card, Icon, ProgressBar } from '../../../shared/ui';
import { getPassStatus, purchasePass } from '../api/passApi';
import type { PassStatus } from '../types';

/** FE2 담당 (PAS-01~04, 전부 P1) */
export default function PassPage() {
  const [status, setStatus] = useState<PassStatus | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    void getPassStatus().then(setStatus);
  }, []);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const result = await purchasePass();
      if (result.success) setStatus((prev) => (prev ? { ...prev, active: true } : prev));
    } finally {
      setPurchasing(false);
    }
  };

  const progress = status ? status.progressDays / status.totalDays : 0;

  return (
    <AppScreen header={<BackHomeButton />} title="패스">
      <Card className="mb-4 flex flex-col items-center gap-3 bg-primary/5 py-6">
        <Icon name="pass" size={84} />
        <p className="text-lg font-bold">피즐리 패스</p>

        {/* PAS-03 패스 보상 안내 */}
        <ul className="w-full space-y-1 text-sm text-muted">
          {status?.benefits.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="text-accent-strong">✓</span>
              {b}
            </li>
          ))}
        </ul>

        {/* PAS-04 패스 진행도 */}
        {status?.active && (
          <div className="w-full">
            <ProgressBar value={progress} label="패스 진행도" />
            <p className="mt-1 text-center text-xs text-muted">
              {status.progressDays} / {status.totalDays}일
            </p>
          </div>
        )}
      </Card>

      {/* PAS-02 패스 구매 */}
      <Button fullWidth disabled={purchasing || status?.active} onClick={() => void handlePurchase()}>
        {status?.active ? '패스 이용 중' : purchasing ? '구매하는 중...' : '패스 구매하기'}
      </Button>
    </AppScreen>
  );
}
