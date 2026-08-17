import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppScreen, BackHomeButton, Card } from '../../../shared/ui';
import { getRecordSummary } from '../api/recordApi';
import type { RecordSummary } from '../types';

/** FE2 담당 (REC-01~04, 전부 P1) */
export default function RecordPage() {
  const [summary, setSummary] = useState<RecordSummary | null>(null);

  useEffect(() => {
    void getRecordSummary().then(setSummary);
  }, []);

  return (
    <AppScreen header={<BackHomeButton />} title="기록">
      <Link
        to="/quests"
        className="mb-4 flex items-center justify-between rounded-card border border-border bg-surface px-4 py-3 text-sm font-semibold active:bg-bg"
      >
        퀘스트 목록 둘러보기
        <span aria-hidden>→</span>
      </Link>

      {/* REC-02 누적 퀘스트 표시 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-xs text-muted">누적 완료 수</p>
          <p className="text-lg font-bold">{summary?.totalCompletedCount ?? 0}개</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-muted">누적 활동 시간</p>
          <p className="text-lg font-bold">{summary?.totalActiveMinutes ?? 0}분</p>
        </Card>
      </div>

      {/* REC-01 오늘 완료 기록 */}
      <Section title="오늘 완료한 퀘스트">
        {summary?.todayQuests.length ? (
          summary.todayQuests.map((log) => (
            <Row key={log.id} left={log.title} right={log.completedAt} />
          ))
        ) : (
          <EmptyText>아직 완료한 퀘스트가 없어요</EmptyText>
        )}
      </Section>

      {/* REC-03 랜덤 상자 기록 */}
      <Section title="랜덤 상자 획득 기록">
        {summary?.boxLogs.length ? (
          summary.boxLogs.map((log) => (
            <Row key={log.id} left={`+${log.gainedExp} EXP`} right={log.obtainedAt} />
          ))
        ) : (
          <EmptyText>아직 획득한 상자가 없어요</EmptyText>
        )}
      </Section>

      {/* REC-04 토큰 기록 */}
      <Section title="토큰 획득·사용 기록">
        {summary?.tokenLogs.length ? (
          summary.tokenLogs.map((log) => (
            <Row
              key={log.id}
              left={log.reason}
              right={`${log.type === 'EARN' ? '+' : ''}${log.amount}`}
              rightClassName={log.type === 'EARN' ? 'text-accent-strong' : 'text-danger'}
            />
          ))
        ) : (
          <EmptyText>아직 토큰 기록이 없어요</EmptyText>
        )}
      </Section>
    </AppScreen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-bold">{title}</p>
      <Card className="divide-y divide-border p-0">{children}</Card>
    </div>
  );
}

function Row({ left, right, rightClassName }: { left: string; right: string; rightClassName?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span>{left}</span>
      <span className={rightClassName ?? 'text-muted'}>{right}</span>
    </div>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="px-4 py-6 text-center text-sm text-muted">{children}</p>;
}
