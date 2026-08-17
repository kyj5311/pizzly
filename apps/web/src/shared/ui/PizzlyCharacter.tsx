import { useRef, useState, type PointerEvent } from 'react';
import pizzlyBase from '../../assets/characters/pizzly-base.png';
import pizzlyMain from '../../assets/characters/pizzly-main.png';
import { cn } from '../lib/cn';

interface PizzlyCharacterProps {
  /** 성장 단계 판정에 쓰는 현재 레벨 */
  level: number;
  size?: number;
  className?: string;
}

const MAX_TILT_DEG = 14;

/**
 * 성장 단계별 캐릭터 이미지. 현재는 base(Lv.1~29) / main(Lv.30~) 2단계 에셋만 있다.
 * 실제 3D 모델(GLB)은 없어서, 포인터 위치에 따른 rotateX/Y 틸트 + 은은한 부유 애니메이션 +
 * 바닥 그림자로 입체감만 흉내낸다. DS가 GLB 모델을 주면 이 컴포넌트를 three.js 렌더러로 교체하면 된다.
 */
export function PizzlyCharacter({ level, size = 160, className }: PizzlyCharacterProps) {
  const src = level >= 30 ? pizzlyMain : pizzlyBase;
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
          alt="피즐리"
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
