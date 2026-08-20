import iconBell from '../../assets/icons/icon-bell.png';
import iconFlag from '../../assets/icons/icon-flag.png';
import iconMenu from '../../assets/icons/icon-menu.png';
import iconPass from '../../assets/icons/icon-pass.png';
import iconQuest from '../../assets/icons/icon-quest.png';
import iconRecord from '../../assets/icons/icon-record.png';
import iconSettings from '../../assets/icons/icon-settings.png';
import iconShop from '../../assets/icons/icon-shop.png';
import iconTimer from '../../assets/icons/icon-timer.png';
import iconToken from '../../assets/icons/icon-token.png';
import { cn } from '../lib/cn';

const ICONS = {
  bell: iconBell,
  flag: iconFlag,
  menu: iconMenu,
  pass: iconPass,
  quest: iconQuest,
  record: iconRecord,
  settings: iconSettings,
  shop: iconShop,
  timer: iconTimer,
  token: iconToken,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
}

/** pizzly_images 에셋 기반 아이콘. DS 정식 아이콘 도착 시 ICONS 매핑의 import 경로만 교체한다. */
export function Icon({ name, size = 24, className, alt = '' }: IconProps) {
  return (
    <img
      src={ICONS[name]}
      width={size}
      height={size}
      alt={alt}
      className={cn('inline-block shrink-0 object-contain', className)}
    />
  );
}
