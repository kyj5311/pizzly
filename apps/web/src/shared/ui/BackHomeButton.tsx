import { Link } from 'react-router-dom';

/** 홈이 아닌 화면 상단에 공통으로 쓰는 홈 복귀 버튼. */
export function BackHomeButton() {
  return (
    <Link
      to="/"
      className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-muted active:opacity-70"
    >
      <span aria-hidden>←</span> 홈으로
    </Link>
  );
}
