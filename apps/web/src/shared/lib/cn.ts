/** 조건부 className 결합. clsx 를 쓰기로 합의했다면 이 파일을 clsx 재노출로 바꾼다. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
