import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppScreen, Card, Icon, PizzlyCharacter, ProgressBar } from '../../../shared/ui';
import type { IconName } from '../../../shared/ui';
import { getHomeStatus } from '../api/homeApi';
import type { HomeStatus } from '../types';

/**
 * FE2 담당 (HOM-01~04).
 * FE1 은 이 파일을 수정하지 않는다 — 퀘스트 진입 경로(/quest/time)만 공유한다.
 * 배경 사진(DS 에셋 자리)은 없어서 그라디언트로 대체하고, 나머지 레이아웃은 시안대로 맞춘다.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<HomeStatus | null>(null);

  useEffect(() => {
    void getHomeStatus().then(setStatus);
  }, []);

  const growthPercent = status ? status.growthCurrent / status.growthTarget : 0;

  return (
    <AppScreen>
      <div className="flex h-full flex-col">
      {/* HOM-01/02 히어로 영역. DS 에셋 자리: 배경 사진(안뜰/벽돌담) — 현재는 그라디언트로 대체 */}
      <div className="relative -mx-5 -mt-8 min-h-[390px] overflow-hidden rounded-b-[32px] bg-gradient-to-b from-primary/25 via-primary/10 to-bg px-5 pb-3 pt-3">
        {/* 좌측: 메뉴 + 퀘스트·설정·상점, 위에서부터 한 줄로. 캐릭터와 겹치지 않게 오버레이로 띄운다 */}
        <div className="absolute left-5 top-3 z-10 flex flex-col items-center gap-3">
          <Icon name="menu" size={68} alt="메뉴" />
          <RailButton to="/quest/time" icon="quest" label="퀘스트" />
          <RailButton icon="settings" label="설정" />
          <RailButton to="/shop" icon="shop" label="상점" />
        </div>

        {/* 우측: 알람 + 패스여부·토큰개수(동일 크기 직사각형), 알림 아래로 순서대로 */}
        <div className="absolute right-5 top-3 z-10 flex flex-col items-end gap-2">
          <span className="relative">
            <Icon name="bell" size={68} alt="알림" />
            <span className="absolute right-1 top-1 h-3 w-3 rounded-full bg-danger ring-2 ring-white" />
          </span>
          <span className="flex w-[84px] flex-col items-center rounded-lg bg-white/95 px-2 py-1.5 shadow-card">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted">
              <Icon name="pass" size={14} />
              패스
            </span>
            <span className="whitespace-nowrap text-xs font-bold text-accent-strong">
              {status?.hasPass ? '이용중' : '미구매'}
            </span>
          </span>
          <span className="flex w-[84px] flex-col items-center rounded-lg bg-white/95 px-2 py-1.5 shadow-card">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted">
              <Icon name="token" size={14} />
              토큰
            </span>
            <span className="whitespace-nowrap text-xs font-bold text-gold-strong">
              {(status?.tokenBalance ?? 0).toLocaleString()}
            </span>
          </span>
        </div>

        {/* 중앙: 인사 문구(말풍선 없이 글자 자체에 디자인) — 헤더 아이콘 아래로 여유를 두고 배치 */}
        <div className="flex flex-col items-center pt-20">
          <div className="text-center leading-tight [paint-order:stroke_fill]">
            <p className="text-base font-extrabold text-white [-webkit-text-stroke:4px_var(--color-primary-strong)] drop-shadow-md">
              안녕하세요!
            </p>
            <p className="text-base font-extrabold text-white [-webkit-text-stroke:4px_var(--color-primary-strong)] drop-shadow-md">
              오늘도 함께해요!
            </p>
          </div>
        </div>
      </div>

      {/* 캐릭터 — 상점 아이콘과 아래 카드 사이 간격을 좁게 두고 배치 */}
      <div className="-mt-32 flex justify-center">
        <PizzlyCharacter level={status?.characterLevel ?? 1} size={205} />
      </div>

      {/* HOM-02 잠깐, 피즐리랑! + HOM-03 오늘 기록 요약 */}
      <div className="mt-8">
        {/* HOM-01 레벨/성장도 카드 — CTA 버튼 바로 위, 한 칸을 반으로 나눈 형태 */}
        <Card className="mb-2">
          <div className="-m-4 flex items-center divide-x divide-border">
            <div className="flex flex-1 items-center gap-1.5 px-3 py-5">
              <span className="text-xl">🐻</span>
              <span className="whitespace-nowrap text-sm font-bold">피즐리 Lv.{status?.characterLevel ?? '-'}</span>
              <span className="whitespace-nowrap rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent-strong">
                성장 중
              </span>
            </div>
            <div className="flex flex-1 items-center gap-2 px-3 py-5">
              <span className="whitespace-nowrap text-xs font-semibold text-muted">
                성장도 {status?.growthCurrent ?? 0}/{status?.growthTarget ?? 0}
              </span>
              <div className="flex-1">
                <ProgressBar value={growthPercent} label="성장도" />
              </div>
            </div>
          </div>
        </Card>

        <button
          type="button"
          onClick={() => navigate('/quest/time')}
          className="mb-2 w-full rounded-button bg-gradient-to-b from-[#9D6BFA] to-[#6D28D9] px-5 py-4 text-white transition
            shadow-[inset_0_2px_0_rgba(255,255,255,0.4),inset_0_-4px_0_rgba(0,0,0,0.28),0_8px_16px_rgba(109,40,217,0.5)]
            active:translate-y-[1px] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]"
        >
          <span className="flex items-center justify-center gap-3">
            <Icon name="timer" size={52} className="drop-shadow shrink-0" />
            <span className="flex flex-col items-start text-left">
              <span className="text-base font-bold">잠깐, 피즐리랑!</span>
              <span className="text-xs font-medium text-white/85">딱 맞는 퀘스트를 찾아드릴게요!</span>
            </span>
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Card className="flex items-center gap-2 bg-primary/5 p-4">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="whitespace-nowrap text-xs text-muted">오늘 완료</p>
              <p className="text-lg font-bold">{status?.todayCompletedCount ?? 0}개</p>
            </div>
          </Card>
          <Card className="flex items-center gap-2 bg-gold/10 p-4">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="whitespace-nowrap text-xs text-muted">누적 퀘스트</p>
              <p className="text-lg font-bold">{status?.totalCompletedCount ?? 0}개</p>
            </div>
          </Card>
        </div>

        <Link
          to="/record"
          className="mt-3 flex items-center justify-between rounded-card border border-border bg-surface px-4 py-3 text-sm font-semibold active:bg-bg"
        >
          전체 기록 보기
          <span aria-hidden>→</span>
        </Link>
      </div>

      {/* 남는 세로 공간은 맨 아래로 몰아서, 위쪽 요소들은 서로 가깝게 붙어 있도록 한다 */}
      <div className="flex-1" />
      </div>
    </AppScreen>
  );
}

function RailButton({ to, icon, label }: { to?: string; icon: IconName; label: string }) {
  const content = (
    <>
      <Icon name={icon} size={68} className="drop-shadow-md" />
      <span className="text-xs font-semibold text-text/80 drop-shadow-sm">{label}</span>
    </>
  );

  if (!to) {
    // 설정 화면은 아직 없어서 비활성 아이콘으로만 둔다
    return <div className="flex w-[84px] flex-col items-center gap-1 opacity-70">{content}</div>;
  }

  return (
    <Link to={to} className="flex w-[84px] flex-col items-center gap-1 active:opacity-70">
      {content}
    </Link>
  );
}
