import { useRef, useState, type PointerEvent } from 'react';
import { appearanceStorage } from '../../utils/appearance-storage';
import { cn } from '../lib/cn';
import { getPizzlyStage } from './pizzly-stages';

interface PizzlyCharacterProps {
  /** 성장 단계 판정에 쓰는 현재 레벨 */
  level: number;
  size?: number;
  className?: string;
}

const MAX_TILT_DEG = 14;

/**
 * 성장 단계별 캐릭터 이미지 (Lv.1 아기 곰 / Lv.30 중간 곰 / Lv.60 성체 곰 / Lv.100 피즐리 베어).
 * 상점의 "처음 곰으로 돌아가기" 아이템을 적용하면 레벨과 무관하게 아기 곰으로 고정된다.
 * 실제 3D 모델(GLB)은 없어서, 포인터 위치에 따른 rotateX/Y 틸트 + 은은한 부유 애니메이션 +
 * 바닥 그림자로 입체감만 흉내낸다. DS가 GLB 모델을 주면 이 컴포넌트를 three.js 렌더러로 교체하면 된다.
 */
export function PizzlyCharacter({ level, size = 160, className }: PizzlyCharacterProps) {
  const effectiveLevel = appearanceStorage.isResetToBase() ? 1 : level;
  const { image: src, name: alt } = getPizzlyStage(effectiveLevel);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -MAX_TILT_DEG, y: px * MAX_TILT_DEG });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={wrapRef}
      className={cn('relative select-none', className)}
      style={{ width: size, height: size, perspective: 700 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerUp={reset}
    >
      <div className="pizzly-float h-full w-full">
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          draggable={false}
          className="h-full w-full object-contain transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        />
      </div>
      <div className="pizzly-shadow mx-auto -mt-2 h-3 w-2/3 rounded-full bg-black/20 blur-[3px]" />
    </div>
  );
}
