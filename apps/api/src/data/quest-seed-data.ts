// PM "피즐리_BE2_추천로직_퀘스트_기준표.xlsx" > 퀘스트_기준표 시트 원본 데이터
// 눈 건강 / 손목·손가락 / 목·어깨 / 호흡·휴식 × 1분·3분·5분 = 총 12개

export interface QuestSeedItem {
  questCode: string
  title: string
  category: 'EYE' | 'WRIST' | 'NECK_SHOULDER' | 'BREATH_REST'
  duration: 'MIN_1' | 'MIN_3' | 'MIN_5'
  steps: string[]
  repsSets: string
  posture: string[]
  environment: string
  guideType: 'PIZZLY_SIGNATURE' | 'GENERAL' | 'EITHER'
  difficulty: 'LOW' | 'MID' | 'HIGH'
  caution: string
  note: string
}

export const QUEST_SEED_DATA: QuestSeedItem[] = [
  {
    questCode: 'EYE_01_01',
    title: '눈 깜빡임 리셋',
    category: 'EYE',
    duration: 'MIN_1',
    steps: ['① 화면에서 시선 떼기', '② 눈을 천천히 완전히 감았다 뜨기', '③ 잠깐 먼 곳 보기'],
    repsSets: '깜빡이기 10회 × 2세트\n세트 사이 10초 먼 곳 보기',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'PIZZLY_SIGNATURE',
    difficulty: 'LOW',
    caution: '눈 통증·심한 불편감이 있으면 중단',
    note: '짧은 화면 휴식용'
  },
  {
    questCode: 'EYE_03_01',
    title: '눈 휴식 3분 루틴',
    category: 'EYE',
    duration: 'MIN_3',
    steps: [
      '① 20초 먼 곳 보기',
      '② 천천히 완전하게 깜빡이기 10회',
      '③ 20초 눈 감고 쉬기',
      '④ 남은 시간은 화면을 보지 않고 편하게 휴식',
      '⑤ 위 흐름 반복'
    ],
    repsSets: '핵심 루틴 3세트 기준',
    posture: ['앉아 있음', '서 있음'],
    environment: '먼 곳을 볼 수 있는 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '시야 확보가 어려운 장소에서는 먼 곳 보기 제외',
    note: '20-20-20 원칙을 응용한 휴식 구성'
  },
  {
    questCode: 'EYE_05_01',
    title: '5분 눈 휴식 챌린지',
    category: 'EYE',
    duration: 'MIN_5',
    steps: [
      '① 먼 곳 보기 30초',
      '② 천천히 완전하게 깜빡이기 10회',
      '③ 눈 감고 휴식 30초',
      '④ 다른 먼 곳 보기 30초',
      '⑤ 천천히 깜빡이기 10회',
      '⑥ 화면 없이 편하게 쉬기 60초',
      '⑦ 남은 시간 같은 흐름 반복'
    ],
    repsSets: '약 5분 동안 1~2회 반복',
    posture: ['앉아 있음', '서 있음'],
    environment: '먼 곳을 볼 수 있는 조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '눈을 세게 누르거나 빠르게 굴리는 동작 제외',
    note: '화면에서 눈을 떼는 것이 핵심'
  },
  {
    questCode: 'WRIST_01_01',
    title: '손목 리셋',
    category: 'WRIST',
    duration: 'MIN_1',
    steps: [
      '① 손목을 편안한 범위에서 바깥쪽으로 돌리기',
      '② 안쪽으로 돌리기',
      '③ 손가락을 크게 펼쳤다가 가볍게 쥐기'
    ],
    repsSets: '손목 각 방향 5회\n손가락 펼치기/쥐기 10회',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'PIZZLY_SIGNATURE',
    difficulty: 'LOW',
    caution: '통증이 느껴지는 범위까지 억지로 움직이지 않기',
    note: '작은 동작 위주'
  },
  {
    questCode: 'WRIST_03_01',
    title: '손목·손가락 풀기',
    category: 'WRIST',
    duration: 'MIN_3',
    steps: [
      '① 손목 좌·우 돌리기',
      '② 손가락 크게 펼치기/가볍게 쥐기',
      '③ 팔꿈치를 몸 옆에 두고 손바닥 위·아래 천천히 돌리기',
      '④ 짧게 손 털며 휴식'
    ],
    repsSets: '각 동작 10회 × 2세트\n세트 사이 15~20초 휴식',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '통증·저림이 심하면 중단',
    note: '키보드·마우스 사용 후 적합'
  },
  {
    questCode: 'WRIST_05_01',
    title: '손 전체 리프레시',
    category: 'WRIST',
    duration: 'MIN_5',
    steps: [
      '① 손목 좌·우 돌리기 10회',
      '② 손가락 펼치기/쥐기 10회',
      '③ 손바닥 위·아래 돌리기 10회',
      '④ 각 손가락을 천천히 굽혔다 펴기',
      '⑤ 20~30초 손 힘 빼고 휴식',
      '⑥ 전체 루틴 반복'
    ],
    repsSets: '전체 루틴 2~3세트',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '통증 유발 동작은 생략',
    note: '반복 사용 후 리프레시용'
  },
  {
    questCode: 'NECK_01_01',
    title: '어깨 리셋',
    category: 'NECK_SHOULDER',
    duration: 'MIN_1',
    steps: ['① 어깨를 귀 쪽으로 천천히 올렸다 내리기', '② 어깨를 뒤쪽으로 천천히 돌리기'],
    repsSets: '으쓱하기 10회\n뒤로 돌리기 5회',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'EITHER',
    difficulty: 'LOW',
    caution: '통증이 있는 범위까지 과도하게 움직이지 않기',
    note: '간단한 상체 긴장 완화'
  },
  {
    questCode: 'NECK_03_01',
    title: '목·어깨 풀기',
    category: 'NECK_SHOULDER',
    duration: 'MIN_3',
    steps: [
      '① 어깨 올렸다 내리기 10회',
      '② 고개를 좌우로 천천히 돌리기',
      '③ 어깨를 뒤로 크게 돌리기',
      '④ 20초 편하게 쉬기',
      '⑤ 루틴 반복'
    ],
    repsSets: '고개 좌우 각 5회\n어깨 돌리기 10회\n전체 2세트',
    posture: ['앉아 있음', '서 있음'],
    environment: '주변 공간이 조금 있는 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지럼증·통증 발생 시 즉시 중단',
    note: '반동 없이 천천히 수행'
  },
  {
    questCode: 'NECK_05_01',
    title: '상체 릴렉스 루틴',
    category: 'NECK_SHOULDER',
    duration: 'MIN_5',
    steps: [
      '① 어깨 으쓱 10회',
      '② 고개 좌우 천천히 돌리기 각 5회',
      '③ 목을 좌우로 가볍게 기울이기 각 5회',
      '④ 어깨 앞/뒤 돌리기 각 10회',
      '⑤ 편한 자세에서 30초 휴식',
      '⑥ 남은 시간 루틴 반복'
    ],
    repsSets: '전체 루틴 2세트 정도',
    posture: ['앉아 있음', '서 있음'],
    environment: '조금 넓은 공간 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '목을 강하게 꺾거나 반동 주기 금지',
    note: '상체 전체 리프레시'
  },
  {
    questCode: 'BREATH_01_01',
    title: '1분 숨 고르기',
    category: 'BREATH_REST',
    duration: 'MIN_1',
    steps: ['① 편한 자세 취하기', '② 어깨 힘 빼기', '③ 코로 편하게 들이마시기', '④ 천천히 내쉬기'],
    repsSets: '약 5초 들숨 + 5초 날숨 × 6회',
    posture: ['앉아 있음', '서 있음'],
    environment: '조용하면 더 좋음',
    guideType: 'EITHER',
    difficulty: 'LOW',
    caution: '숨을 억지로 참거나 과하게 깊게 쉬지 않기',
    note: '편안한 호흡이 우선'
  },
  {
    questCode: 'BREATH_03_01',
    title: '3분 호흡 리셋',
    category: 'BREATH_REST',
    duration: 'MIN_3',
    steps: [
      '① 편하게 앉거나 서기',
      '② 어깨와 턱 힘 빼기',
      '③ 4~5초 정도 편하게 들이마시기',
      '④ 4~5초 정도 천천히 내쉬기',
      '⑤ 호흡 감각에만 가볍게 집중'
    ],
    repsSets: '약 3분 반복',
    posture: ['앉아 있음', '서 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지럽거나 불편하면 자연 호흡으로 복귀',
    note: '호흡 속도는 사용자 편안함 우선'
  },
  {
    questCode: 'BREATH_05_01',
    title: '5분 마음 휴식',
    category: 'BREATH_REST',
    duration: 'MIN_5',
    steps: [
      '① 편안한 자세 만들기',
      '② 코로 천천히 들이마시기',
      '③ 입 또는 코로 천천히 내쉬기',
      '④ 호흡에 가볍게 집중',
      '⑤ 중간에 어깨·손 힘 풀기',
      '⑥ 약 5분 동안 반복'
    ],
    repsSets: '약 5초 들숨 + 5초 날숨을 편안한 범위에서 반복',
    posture: ['앉아 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '호흡을 억지로 길게 유지하지 않기',
    note: '휴식 목적, 치료 목적 아님'
  }
]
