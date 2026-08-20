import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { OnboardingPayload, Restriction, WellnessArea } from '../types/onboarding';

interface OnboardingApi {
  payload: OnboardingPayload;
  toggleInterest: (value: WellnessArea) => void;
  toggleRestriction: (value: Restriction) => void;
}

const OnboardingContext = createContext<OnboardingApi | null>(null);

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/** 온보딩 3화면(ONB-01~03)의 선택값을 한 곳에 모은다. */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<OnboardingPayload>({ interests: [], restrictions: [] });

  const value = useMemo<OnboardingApi>(
    () => ({
      payload,
      toggleInterest: (item) =>
        setPayload((prev) => ({ ...prev, interests: toggle(prev.interests, item) })),
      toggleRestriction: (item) =>
        setPayload((prev) => ({ ...prev, restrictions: toggle(prev.restrictions, item) })),
    }),
    [payload],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingApi {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding 은 OnboardingProvider 안에서만 사용할 수 있습니다.');
  return context;
}
