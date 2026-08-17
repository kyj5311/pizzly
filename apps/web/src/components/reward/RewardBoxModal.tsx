import { useState } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface RewardBoxModalProps {
  open: boolean;
  /** 상자에서 나온 추가 경험치 */
  bonusExp: number;
  onClose: () => void;
}

/**
 * [REW-02, REW-03] 랜덤 상자 등장 · 보상 확인.
 * DS 복귀 전까지 기본 모달로 대체 — 복귀 후 이 파일 내부 연출만 교체한다.
 */
export function RewardBoxModal({ open, bonusExp, onClose }: RewardBoxModalProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Modal open={open} title={opened ? '보상을 받았어요!' : '랜덤 상자가 나타났어요'}>
      {/* DS 에셋 자리: 상자 등장·열림 연출 */}
      <div className="mb-5 flex h-32 items-center justify-center">
        <Gift className="size-16 text-primary" aria-hidden />
      </div>

      {opened ? (
        <>
          <p className="mb-5 text-center text-lg font-bold">추가 경험치 +{bonusExp}</p>
          <Button fullWidth onClick={onClose}>
            확인
          </Button>
        </>
      ) : (
        <>
          <p className="mb-5 text-center text-ink-muted">열어보면 추가 경험치를 받을 수 있어요.</p>
          <Button fullWidth onClick={() => setOpened(true)}>
            상자 열기
          </Button>
        </>
      )}
    </Modal>
  );
}
