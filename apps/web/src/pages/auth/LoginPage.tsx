import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, Button } from '../../shared/ui';
import { login, TEST_ACCOUNTS } from '../../api/auth-api';

/**
 * [LOG-01] 로그인.
 * 팀 확정 사항: 정식 소셜 로그인 미구현, 사전 준비된 테스트 계정으로 접속한다.
 * 여러 명이 동시에 시연/테스트해도 서로의 레벨·토큰·구매 상태가 섞이지 않도록 계정 4개 중 하나를 고른다.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [pendingAccount, setPendingAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (accountId: (typeof TEST_ACCOUNTS)[number]) => {
    setPendingAccount(accountId);
    setError(null);
    try {
      await login(accountId);
      navigate('/onboarding/interests');
    } catch {
      setError('로그인에 실패했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setPendingAccount(null);
    }
  };

  return (
    <AppScreen title="피즐리와 함께 시작해요" subtitle="틈새시간에 딱 맞는 웰니스 퀘스트를 추천해 드려요.">
      <div className="mt-10 flex flex-col gap-3">
        {TEST_ACCOUNTS.map((accountId, index) => (
          <Button
            key={accountId}
            fullWidth
            disabled={pendingAccount !== null}
            onClick={() => void handleLogin(accountId)}
          >
            {pendingAccount === accountId ? '접속하는 중' : `테스트 계정 ${index + 1}로 시작하기`}
          </Button>
        ))}
        {error && <p className="text-center text-sm text-danger">{error}</p>}
      </div>
    </AppScreen>
  );
}
