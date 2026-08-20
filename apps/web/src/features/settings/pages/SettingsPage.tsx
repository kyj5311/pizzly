import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppScreen, BackHomeButton, Button, Card, PizzlyCharacter } from '../../../shared/ui';
import { ApiError } from '../../../shared/api/types';
import { COSTUME_ITEMS } from '../../../shared/ui/costume-items';
import { PIZZLY_STAGES } from '../../../shared/ui/pizzly-stages';
import { costumeStorage } from '../../../utils/costume-storage';
import { devModeStorage } from '../../../utils/dev-mode-storage';
import { inventoryStorage } from '../../../utils/inventory-storage';
import { setDevLevel, setDevToken } from '../../growth/api/growthApi';
import { getHomeStatus } from '../../home/api/homeApi';

/** FE2 담당. 설정 화면 — 성장 단계 안내 + 코스튬 장착. */
export default function SettingsPage() {
  const stagesAscending = [...PIZZLY_STAGES].reverse();
  const [equipped, setEquipped] = useState(() => costumeStorage.getEquipped());
  const [owned] = useState(() => inventoryStorage.getOwned());
  const [devMode, setDevMode] = useState(() => devModeStorage.isOn());
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [currentExp, setCurrentExp] = useState<number | null>(null);
  const [currentToken, setCurrentToken] = useState<number | null>(null);
  const [levelInput, setLevelInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [levelError, setLevelError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [applyingLevel, setApplyingLevel] = useState(false);
  const [applyingToken, setApplyingToken] = useState(false);
  const [restoringLevel, setRestoringLevel] = useState(false);

  useEffect(() => {
    void getHomeStatus().then((status) => {
      // 레벨/성장도(0~99)로 원래 누적 경험치를 역산해서, 개발자 모드를 끌 때 정확히 복원한다.
      const exp = (status.characterLevel - 1) * 100 + status.growthCurrent;
      setCurrentLevel(status.characterLevel);
      setCurrentExp(exp);
      setCurrentToken(status.tokenBalance);
      setLevelInput(String(status.characterLevel));
      setTokenInput(String(status.tokenBalance));
      // 새로고침 등으로 개발자 모드가 켜진 채 다시 들어온 경우, snapshot이 없으면 지금 값을 원본으로 저장한다.
      if (devModeStorage.isOn() && !devModeStorage.getSnapshot()) {
        devModeStorage.setSnapshot({ level: status.characterLevel, exp, token: status.tokenBalance });
      }
    });
  }, []);

  const handleToggle = (id: (typeof COSTUME_ITEMS)[number]['id']) => {
    costumeStorage.toggle(id);
    setEquipped(costumeStorage.getEquipped());
  };

  const handleToggleDevMode = async () => {
    if (!devMode) {
      // 켤 때: 지금 값을 원본으로 저장해둔다.
      if (currentLevel !== null && currentExp !== null && currentToken !== null) {
        devModeStorage.setSnapshot({ level: currentLevel, exp: currentExp, token: currentToken });
      }
      devModeStorage.set(true);
      setDevMode(true);
      return;
    }

    // 끌 때: 저장해둔 원본 레벨/경험치/토큰으로 되돌린다.
    const snapshot = devModeStorage.getSnapshot();
    if (!snapshot) {
      devModeStorage.set(false);
      setDevMode(false);
      return;
    }

    setRestoringLevel(true);
    setLevelError(null);
    try {
      const [levelResult, tokenResult] = await Promise.all([
        setDevLevel(snapshot.level, snapshot.exp),
        setDevToken(snapshot.token),
      ]);
      setCurrentLevel(levelResult.level);
      setCurrentExp(levelResult.exp);
      setCurrentToken(tokenResult.token);
      setLevelInput(String(levelResult.level));
      setTokenInput(String(tokenResult.token));
      devModeStorage.clearSnapshot();
      devModeStorage.set(false);
      setDevMode(false);
    } catch (err) {
      setLevelError(err instanceof ApiError ? err.message : '원래 값으로 되돌리는 데 실패했어요.');
    } finally {
      setRestoringLevel(false);
    }
  };

  const handleApplyLevel = async () => {
    const level = Number(levelInput);
    if (!Number.isInteger(level) || level < 1) {
      setLevelError('1 이상의 정수를 입력해 주세요.');
      return;
    }
    setApplyingLevel(true);
    setLevelError(null);
    try {
      const result = await setDevLevel(level);
      setCurrentLevel(result.level);
      setCurrentExp(result.exp);
    } catch (err) {
      setLevelError(err instanceof ApiError ? err.message : '레벨 변경에 실패했어요.');
    } finally {
      setApplyingLevel(false);
    }
  };

  const handleApplyToken = async () => {
    const token = Number(tokenInput);
    if (!Number.isInteger(token) || token < 0) {
      setTokenError('0 이상의 정수를 입력해 주세요.');
      return;
    }
    setApplyingToken(true);
    setTokenError(null);
    try {
      const result = await setDevToken(token);
      setCurrentToken(result.token);
    } catch (err) {
      setTokenError(err instanceof ApiError ? err.message : '토큰 변경에 실패했어요.');
    } finally {
      setApplyingToken(false);
    }
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

      <section className="mt-6 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">개발자 모드</h2>
            <p className="text-xs text-muted">QA용 기능이에요. 레벨·토큰을 직접 바꿔볼 수 있어요.</p>
          </div>
          <Button
            variant={devMode ? 'primary' : 'secondary'}
            disabled={restoringLevel}
            onClick={() => void handleToggleDevMode()}
          >
            {restoringLevel ? '되돌리는 중' : devMode ? '켜짐' : '꺼짐'}
          </Button>
        </div>

        {devMode && (
          <Card className="mt-3">
            <p className="mb-2 text-sm text-muted">
              현재 레벨: <span className="font-semibold text-text">{currentLevel ?? '-'}</span>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={levelInput}
                onChange={(e) => setLevelInput(e.target.value)}
                className="w-full rounded-button border border-border bg-surface px-3 py-2 text-sm"
                placeholder="레벨 입력"
              />
              <Button
                className="shrink-0 whitespace-nowrap"
                disabled={applyingLevel}
                onClick={() => void handleApplyLevel()}
              >
                {applyingLevel ? '적용 중' : '적용'}
              </Button>
            </div>
            {levelError && <p className="mt-2 text-sm text-danger">{levelError}</p>}
          </Card>
        )}

        {devMode && (
          <Card className="mt-3">
            <p className="mb-2 text-sm text-muted">
              현재 토큰: <span className="font-semibold text-text">{currentToken ?? '-'}</span>
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full rounded-button border border-border bg-surface px-3 py-2 text-sm"
                placeholder="토큰 입력"
              />
              <Button
                className="shrink-0 whitespace-nowrap"
                disabled={applyingToken}
                onClick={() => void handleApplyToken()}
              >
                {applyingToken ? '적용 중' : '적용'}
              </Button>
            </div>
            {tokenError && <p className="mt-2 text-sm text-danger">{tokenError}</p>}
          </Card>
        )}
      </section>
    </AppScreen>
  );
}
