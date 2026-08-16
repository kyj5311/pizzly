import { useNavigate } from 'react-router-dom';
import { AppScreen } from '../components/ui/AppScreen';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

/**
 * ⚠️ FE2 담당 영역(HOM-01~04)의 임시 자리입니다.
 * FE1 이 퀘스트 진입/복귀 경로를 확인하려고 최소한만 둔 것이므로,
 * FE2 가 홈 화면을 구현하면 이 파일은 삭제합니다.
 */
export default function HomePlaceholderPage() {
  const navigate = useNavigate();

  return (
    <AppScreen title="피즐리" subtitle="※ 홈 화면은 FE2 담당 — 임시 자리입니다.">
      <Card className="mb-4 text-ink-muted">캐릭터 상태 · 레벨 · 성장도 · 토큰 (HOM-01)</Card>
      <Card className="mb-6 text-ink-muted">오늘 완료 기록 · 누적 퀘스트 수 (HOM-03)</Card>
      <Button fullWidth onClick={() => navigate('/quest/time')}>
        잠깐, 피즐리랑!
      </Button>
    </AppScreen>
  );
}
