import pizzlyBase from '../../assets/characters/pizzly-base.png';
import pizzlyLevel30 from '../../assets/characters/pizzly-level30.png';
import pizzlyLevel60 from '../../assets/characters/pizzly-level60.png';
import pizzlyLevel100 from '../../assets/characters/pizzly-level100.png';

export interface PizzlyStage {
  minLevel: number;
  name: string;
  image: string;
  description: string;
}

/** 피즐리 베어 성장 단계 (레벨 기준). minLevel 내림차순으로 순회해 매칭한다. */
export const PIZZLY_STAGES: PizzlyStage[] = [
  {
    minLevel: 100,
    name: '피즐리 베어',
    image: pizzlyLevel100,
    description: '전설의 힘을 지닌 피즐리 베어! 따뜻한 마음과 압도적인 힘으로 모두를 지키는 위대한 리더가 되었습니다.',
  },
  {
    minLevel: 60,
    name: '성체 곰',
    image: pizzlyLevel60,
    description: '진정한 힘을 갖춘 성체 곰. 든든한 체격과 강한 힘으로 동료들을 보호하고 어떤 위험도 두렵지 않습니다.',
  },
  {
    minLevel: 30,
    name: '중간 곰',
    image: pizzlyLevel30,
    description: '모험을 통해 자신감을 얻은 곰. 몸집이 커지고 힘도 강해졌으며 친구들을 지켜줄 수 있습니다.',
  },
  {
    minLevel: 1,
    name: '아기 곰',
    image: pizzlyBase,
    description: '세상에 호기심이 가득한 아기 곰. 아직은 작고 여리지만 무한한 가능성을 가지고 있습니다.',
  },
];

export function getPizzlyStage(level: number): PizzlyStage {
  return PIZZLY_STAGES.find((stage) => level >= stage.minLevel) ?? PIZZLY_STAGES[PIZZLY_STAGES.length - 1];
}
