// PM "피즐리_BE2_확장_퀘스트_기준표_36개.xlsx" > 확장_퀘스트_기준표 시트 원본 데이터
// 눈 건강 / 손목·손가락 / 목·어깨 / 호흡·휴식 × 1분·3분·5분 × 3개 = 총 36개
// 기존 대표 퀘스트 12개(questCode 끝자리 _01)는 문구가 일부 다듬어져 이번 버전으로 갱신됨

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
  // ---- 눈 건강 ----
  {
    questCode: 'EYE_01_01',
    title: '눈 깜빡임 리셋',
    category: 'EYE',
    duration: 'MIN_1',
    steps: ['① 화면에서 시선 떼기', '② 눈을 천천히 완전히 감았다 뜨기', '③ 10초 정도 먼 곳 바라보기'],
    repsSets: '깜빡이기 10회 × 2세트\n세트 사이 10초 먼 곳 보기',
    posture: ['앉아 있음', '서 있음'],
    environment: '먼 곳을 볼 수 있는 장소',
    guideType: 'PIZZLY_SIGNATURE',
    difficulty: 'LOW',
    caution: '눈 통증·시야 이상·심한 불편감이 있으면 중단',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'EYE_01_02',
    title: '20초 먼 곳 보기',
    category: 'EYE',
    duration: 'MIN_1',
    steps: [
      '① 화면을 내려놓기',
      '② 약 6m 이상 먼 곳을 20초 바라보기',
      '③ 어깨 힘 빼고 자연스럽게 깜빡이기',
      '④ 남은 시간 한 번 더 반복'
    ],
    repsSets: '20초 먼 곳 보기 × 2회\n중간 자연 깜빡임',
    posture: ['앉아 있음', '서 있음'],
    environment: '창문 또는 먼 시야 확보 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '먼 시야 확보가 어려우면 다른 퀘스트 추천',
    note: '20-20-20 원칙 응용'
  },
  {
    questCode: 'EYE_01_03',
    title: '화면 OFF 눈 휴식',
    category: 'EYE',
    duration: 'MIN_1',
    steps: [
      '① 스마트폰 화면을 잠시 끄거나 아래로 두기',
      '② 눈을 편하게 감고 20초 쉬기',
      '③ 눈을 뜬 뒤 먼 곳을 20초 보기',
      '④ 남은 시간 자연스럽게 깜빡이며 쉬기'
    ],
    repsSets: '눈 감고 20초 + 먼 곳 20초 + 자유 휴식 20초',
    posture: ['앉아 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '이동 중에는 눈 감기 단계 제외',
    note: '화면 자체에서 쉬는 퀘스트'
  },
  {
    questCode: 'EYE_03_01',
    title: '눈 휴식 3분 루틴',
    category: 'EYE',
    duration: 'MIN_3',
    steps: [
      '① 20초 먼 곳 보기',
      '② 완전히 깜빡이기 10회',
      '③ 20초 눈 감고 쉬기',
      '④ 화면을 보지 않고 편하게 휴식',
      '⑤ 루틴 반복'
    ],
    repsSets: '핵심 루틴 3세트 기준',
    posture: ['앉아 있음', '서 있음'],
    environment: '먼 곳을 볼 수 있는 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '시야 확보가 어려우면 먼 곳 보기 대체',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'EYE_03_02',
    title: '20-20-20 미니 세트',
    category: 'EYE',
    duration: 'MIN_3',
    steps: [
      '① 먼 곳 20초 보기',
      '② 자연스럽게 깜빡이기 20초',
      '③ 어깨·목 힘 빼고 화면 없이 20초 쉬기',
      '④ 위 순서를 반복'
    ],
    repsSets: '60초 루틴 × 3세트',
    posture: ['앉아 있음', '서 있음'],
    environment: '먼 시야 확보 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '운전·보행 중에는 화면 조작 금지',
    note: '눈과 상체 긴장 함께 완화'
  },
  {
    questCode: 'EYE_03_03',
    title: '눈 감고 리셋',
    category: 'EYE',
    duration: 'MIN_3',
    steps: [
      '① 눈을 편하게 감고 30초 쉬기',
      '② 눈을 뜨고 먼 곳을 30초 보기',
      '③ 천천히 깜빡이기 10회',
      '④ 남은 시간 같은 흐름 반복'
    ],
    repsSets: '약 1분 루틴 × 3세트',
    posture: ['앉아 있음'],
    environment: '조용한 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '이동 중 또는 주변 확인이 필요한 상황 제외',
    note: '안구를 누르지 않도록 안내'
  },
  {
    questCode: 'EYE_05_01',
    title: '5분 눈 휴식 챌린지',
    category: 'EYE',
    duration: 'MIN_5',
    steps: [
      '① 먼 곳 보기 30초',
      '② 완전히 깜빡이기 10회',
      '③ 눈 감고 30초 휴식',
      '④ 다른 먼 곳 보기 30초',
      '⑤ 깜빡이기 10회',
      '⑥ 화면 없이 60초 휴식',
      '⑦ 남은 시간 반복'
    ],
    repsSets: '약 5분 동안 1~2회 반복',
    posture: ['앉아 있음', '서 있음'],
    environment: '먼 곳을 볼 수 있는 조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '눈을 세게 누르거나 빠르게 굴리지 않기',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'EYE_05_02',
    title: '스크린 브레이크 5',
    category: 'EYE',
    duration: 'MIN_5',
    steps: [
      '① 화면을 완전히 내려놓기',
      '② 먼 곳 40초 보기',
      '③ 자연 깜빡임 20초',
      '④ 눈 감고 40초 휴식',
      '⑤ 먼 곳 40초 보기',
      '⑥ 남은 시간 화면 없이 자유롭게 쉬기'
    ],
    repsSets: '약 2분 핵심 루틴 + 3분 화면 OFF 휴식',
    posture: ['앉아 있음', '서 있음'],
    environment: '창가·휴게공간 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '이동 중 눈 감기 제외',
    note: '단순하고 구현 쉬운 5분 콘텐츠'
  },
  {
    questCode: 'EYE_05_03',
    title: '눈·목 함께 쉬기',
    category: 'EYE',
    duration: 'MIN_5',
    steps: [
      '① 먼 곳 보기 30초',
      '② 깜빡이기 10회',
      '③ 어깨를 편하게 내리고 30초 휴식',
      '④ 눈 감고 30초',
      '⑤ 먼 곳 보기 30초',
      '⑥ 화면 없이 편하게 1분',
      '⑦ 남은 시간 반복'
    ],
    repsSets: '약 2분 루틴 × 2세트 + 마무리 휴식',
    posture: ['앉아 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '통증이 있으면 목 동작 없이 눈 휴식만',
    note: '눈 피로와 자세 긴장을 함께 고려'
  },

  // ---- 손목·손가락 ----
  {
    questCode: 'WRIST_01_01',
    title: '손목 리셋',
    category: 'WRIST',
    duration: 'MIN_1',
    steps: [
      '① 손목을 편안한 범위에서 바깥쪽으로 돌리기',
      '② 안쪽으로 돌리기',
      '③ 손가락 크게 펼쳤다가 가볍게 쥐기'
    ],
    repsSets: '손목 각 방향 5회\n손가락 펼치기/쥐기 10회',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'PIZZLY_SIGNATURE',
    difficulty: 'LOW',
    caution: '통증 범위까지 억지로 움직이지 않기',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'WRIST_01_02',
    title: '손가락 활짝 리셋',
    category: 'WRIST',
    duration: 'MIN_1',
    steps: [
      '① 양손 손가락을 최대한 편안하게 펼치기',
      '② 가볍게 주먹 쥐기',
      '③ 다시 천천히 펴기',
      '④ 마지막 10초 손 힘 빼기'
    ],
    repsSets: '펼치기/쥐기 10회 × 2세트',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'EITHER',
    difficulty: 'LOW',
    caution: '손가락 통증 시 범위 축소 또는 중단',
    note: '장비 필요 없음'
  },
  {
    questCode: 'WRIST_01_03',
    title: '손바닥 뒤집기',
    category: 'WRIST',
    duration: 'MIN_1',
    steps: [
      '① 팔꿈치를 몸 옆에 붙이기',
      '② 손바닥이 위를 향하게 천천히 돌리기',
      '③ 다시 아래를 향하게 돌리기',
      '④ 좌우 손 번갈아 반복'
    ],
    repsSets: '양쪽 각 10회',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '통증·저림 발생 시 중단',
    note: '전완 회전 가동성 중심'
  },
  {
    questCode: 'WRIST_03_01',
    title: '손목·손가락 풀기',
    category: 'WRIST',
    duration: 'MIN_3',
    steps: [
      '① 손목 좌·우 돌리기',
      '② 손가락 펼치기/쥐기',
      '③ 손바닥 위·아래 돌리기',
      '④ 짧게 손 털며 휴식'
    ],
    repsSets: '각 동작 10회 × 2세트\n세트 사이 15~20초 휴식',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '통증·저림이 심하면 중단',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'WRIST_03_02',
    title: '키보드 브레이크',
    category: 'WRIST',
    duration: 'MIN_3',
    steps: [
      '① 손을 키보드/마우스에서 떼기',
      '② 손가락 펼치기 10회',
      '③ 손목 위·아래 천천히 움직이기 각 10회',
      '④ 손바닥 위·아래 돌리기 10회',
      '⑤ 20초 손 힘 빼기',
      '⑥ 한 번 더 반복'
    ],
    repsSets: '약 80초 루틴 × 2세트',
    posture: ['앉아 있음'],
    environment: '책상 앞',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '통증 발생 시 해당 동작 생략',
    note: '사무/공부 상황에 적합'
  },
  {
    questCode: 'WRIST_03_03',
    title: '손목 가동성 3분',
    category: 'WRIST',
    duration: 'MIN_3',
    steps: [
      '① 손목 위로 천천히 올리기 10회',
      '② 아래로 내리기 10회',
      '③ 좌우로 편안하게 움직이기 각 10회',
      '④ 손가락 펼치기 10회',
      '⑤ 20초 휴식 후 반복'
    ],
    repsSets: '전체 2세트',
    posture: ['앉아 있음'],
    environment: '팔을 편하게 둘 수 있는 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '무게·밴드 사용 없음, 통증 시 중단',
    note: '가벼운 능동 ROM 중심'
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
      '④ 각 손가락 천천히 굽혔다 펴기',
      '⑤ 20~30초 휴식',
      '⑥ 전체 반복'
    ],
    repsSets: '전체 루틴 2~3세트',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '통증 유발 동작 생략',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'WRIST_05_02',
    title: '손 사용 리셋 5',
    category: 'WRIST',
    duration: 'MIN_5',
    steps: [
      '① 손가락 펼치기/쥐기 10회',
      '② 손목 위·아래 각 10회',
      '③ 손목 좌우 각 10회',
      '④ 손바닥 위·아래 10회',
      '⑤ 30초 휴식',
      '⑥ 2세트 반복',
      '⑦ 마지막 1분 손 힘 빼고 쉬기'
    ],
    repsSets: '운동 루틴 2세트 + 마무리 휴식',
    posture: ['앉아 있음'],
    environment: '책상/휴게공간',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '저림·통증이 지속되면 중단',
    note: '반복 사용 후 회복용'
  },
  {
    questCode: 'WRIST_05_03',
    title: '손목·손가락 믹스',
    category: 'WRIST',
    duration: 'MIN_5',
    steps: [
      '① 손가락 펼치기 10회',
      '② 손바닥 뒤집기 10회',
      '③ 손목 원 그리기 각 방향 5회',
      '④ 손목 위·아래 각 10회',
      '⑤ 30초 휴식',
      '⑥ 전체 2세트'
    ],
    repsSets: '전체 2세트, 남은 시간 편하게 휴식',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '빠르게 돌리거나 큰 범위 강요 금지',
    note: '다양성 확보용'
  },

  // ---- 목·어깨 ----
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
    caution: '통증 범위까지 과도하게 움직이지 않기',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'NECK_01_02',
    title: '목 좌우 천천히',
    category: 'NECK_SHOULDER',
    duration: 'MIN_1',
    steps: [
      '① 정면을 보기',
      '② 왼쪽으로 편안한 범위까지 천천히 돌리기',
      '③ 가운데 돌아오기',
      '④ 오른쪽도 동일하게 진행'
    ],
    repsSets: '좌우 각 3회\n끝 범위에서 약 5초',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지럼·통증 시 즉시 중단',
    note: 'NHS neck rotation 예시 기반'
  },
  {
    questCode: 'NECK_01_03',
    title: '어깨 원 그리기',
    category: 'NECK_SHOULDER',
    duration: 'MIN_1',
    steps: [
      '① 어깨 힘 빼기',
      '② 양 어깨를 뒤로 천천히 원 그리기',
      '③ 앞으로 천천히 원 그리기',
      '④ 마지막 10초 편하게 쉬기'
    ],
    repsSets: '뒤로 8회 + 앞으로 8회',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'EITHER',
    difficulty: 'LOW',
    caution: '어깨 통증 시 작은 범위로 수행',
    note: '상체 긴장 완화'
  },
  {
    questCode: 'NECK_03_01',
    title: '목·어깨 풀기',
    category: 'NECK_SHOULDER',
    duration: 'MIN_3',
    steps: [
      '① 어깨 올렸다 내리기 10회',
      '② 고개 좌우 천천히 돌리기',
      '③ 어깨 뒤로 돌리기',
      '④ 20초 휴식',
      '⑤ 반복'
    ],
    repsSets: '고개 좌우 각 5회\n어깨 돌리기 10회\n전체 2세트',
    posture: ['앉아 있음', '서 있음'],
    environment: '주변 공간이 조금 있는 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지럼증·통증 발생 시 즉시 중단',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'NECK_03_02',
    title: '상체 자세 리셋',
    category: 'NECK_SHOULDER',
    duration: 'MIN_3',
    steps: [
      '① 어깨를 아래로 편하게 내리기',
      '② 턱을 가볍게 뒤로 당겨 정렬 5초',
      '③ 풀기',
      '④ 어깨 뒤로 돌리기 10회',
      '⑤ 목 좌우 회전 각 3회',
      '⑥ 20초 휴식 후 반복'
    ],
    repsSets: '턱 당기기 5회\n어깨 10회\n목 좌우 각 3회 × 2세트',
    posture: ['앉아 있음'],
    environment: '책상/의자 있는 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '목 통증·팔 저림이 있으면 중단',
    note: '강하게 당기지 않도록 안내'
  },
  {
    questCode: 'NECK_03_03',
    title: '어깨 집중 3분',
    category: 'NECK_SHOULDER',
    duration: 'MIN_3',
    steps: ['① 어깨 으쓱 10회', '② 어깨 뒤로 10회', '③ 앞으로 10회', '④ 팔 힘 빼고 20초 휴식', '⑤ 전체 루틴 반복'],
    repsSets: '약 60~70초 루틴 × 2세트 + 휴식',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어깨 통증 시 범위 축소',
    note: '목 움직임 적은 대안'
  },
  {
    questCode: 'NECK_05_01',
    title: '상체 릴렉스 루틴',
    category: 'NECK_SHOULDER',
    duration: 'MIN_5',
    steps: [
      '① 어깨 으쓱 10회',
      '② 고개 좌우 천천히 각 5회',
      '③ 목 좌우 가볍게 기울이기 각 5회',
      '④ 어깨 앞/뒤 각 10회',
      '⑤ 30초 휴식',
      '⑥ 반복'
    ],
    repsSets: '전체 2세트 정도',
    posture: ['앉아 있음', '서 있음'],
    environment: '조금 넓은 공간 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '목을 강하게 꺾거나 반동 주기 금지',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'NECK_05_02',
    title: '책상 탈출 상체 5',
    category: 'NECK_SHOULDER',
    duration: 'MIN_5',
    steps: [
      '① 자리에서 일어나거나 자세 바로잡기',
      '② 어깨 뒤로 10회',
      '③ 목 좌우 각 3회, 5초 유지',
      '④ 어깨 으쓱 10회',
      '⑤ 30초 편하게 호흡',
      '⑥ 전체 2세트',
      '⑦ 마지막 1분 자유 휴식'
    ],
    repsSets: '전체 2세트 + 1분 휴식',
    posture: ['앉아 있음', '서 있음'],
    environment: '책상 주변',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지럼·통증 시 목 동작 제외',
    note: '공부/업무 중간 브레이크용'
  },
  {
    questCode: 'NECK_05_03',
    title: '목·어깨 천천히 5',
    category: 'NECK_SHOULDER',
    duration: 'MIN_5',
    steps: [
      '① 정면 자세 20초',
      '② 목 좌우 회전 각 3회',
      '③ 어깨 앞/뒤 각 10회',
      '④ 턱 가볍게 당기기 5회',
      '⑤ 어깨 힘 빼고 30초 쉬기',
      '⑥ 2세트 반복'
    ],
    repsSets: '전체 2세트',
    posture: ['앉아 있음'],
    environment: '조용한 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '증상이 심하면 운동 대신 휴식 권장',
    note: '빠른 움직임 없음'
  },

  // ---- 호흡·휴식 ----
  {
    questCode: 'BREATH_01_01',
    title: '1분 숨 고르기',
    category: 'BREATH_REST',
    duration: 'MIN_1',
    steps: ['① 편한 자세', '② 어깨 힘 빼기', '③ 코로 편하게 들이마시기', '④ 천천히 내쉬기'],
    repsSets: '약 5초 들숨 + 5초 날숨 × 6회',
    posture: ['앉아 있음', '서 있음'],
    environment: '조용하면 더 좋음',
    guideType: 'EITHER',
    difficulty: 'LOW',
    caution: '숨을 억지로 참거나 과하게 깊게 쉬지 않기',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'BREATH_01_02',
    title: '어깨 힘 빼고 호흡',
    category: 'BREATH_REST',
    duration: 'MIN_1',
    steps: [
      '① 어깨를 한 번 올렸다 편하게 내리기',
      '② 자연스럽게 들이마시기',
      '③ 천천히 내쉬기',
      '④ 내쉴 때 어깨 힘을 더 풀기'
    ],
    repsSets: '편안한 호흡 5~6회',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'EITHER',
    difficulty: 'LOW',
    caution: '어지러우면 즉시 자연 호흡으로',
    note: '호흡과 긴장 완화 결합'
  },
  {
    questCode: 'BREATH_01_03',
    title: '화면 없는 60초',
    category: 'BREATH_REST',
    duration: 'MIN_1',
    steps: [
      '① 화면을 내려놓기',
      '② 20초 자연 호흡',
      '③ 주변 소리나 몸의 감각에 20초 집중',
      '④ 마지막 20초 천천히 호흡'
    ],
    repsSets: '60초 연속',
    posture: ['앉아 있음', '서 있음'],
    environment: '대부분 가능',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '보행/운전 중 화면 조작 금지',
    note: '명상보다 가벼운 휴식 형태'
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
      '⑤ 호흡 감각에 집중'
    ],
    repsSets: '약 3분 반복',
    posture: ['앉아 있음', '서 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지럽거나 불편하면 자연 호흡으로 복귀',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'BREATH_03_02',
    title: '1부터 5까지 호흡',
    category: 'BREATH_REST',
    duration: 'MIN_3',
    steps: [
      '① 코로 부드럽게 숨 들이쉬며 1~5 세기',
      '② 편하게 내쉬며 1~5 세기',
      '③ 숫자에 집착하지 않고 편한 속도로 반복',
      '④ 마지막 20초 자연 호흡'
    ],
    repsSets: '약 2분 40초 반복 + 20초 자연 호흡',
    posture: ['앉아 있음', '서 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '5까지 세는 게 불편하면 짧게 조절',
    note: 'NHS 안내 방식 반영'
  },
  {
    questCode: 'BREATH_03_03',
    title: '화면 OFF 호흡 휴식',
    category: 'BREATH_REST',
    duration: 'MIN_3',
    steps: [
      '① 스마트폰을 내려놓기',
      '② 1분 자연 호흡',
      '③ 1분 천천히 들이쉬고 내쉬기',
      '④ 1분 어깨·손 힘 빼고 편하게 쉬기'
    ],
    repsSets: '1분 × 3단계',
    posture: ['앉아 있음'],
    environment: '조용한 장소',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지러우면 호흡 조절 없이 자연스럽게 쉬기',
    note: '구현이 단순한 3단계 타이머'
  },
  {
    questCode: 'BREATH_05_01',
    title: '5분 마음 휴식',
    category: 'BREATH_REST',
    duration: 'MIN_5',
    steps: [
      '① 편안한 자세',
      '② 코로 천천히 들이마시기',
      '③ 입 또는 코로 천천히 내쉬기',
      '④ 호흡에 가볍게 집중',
      '⑤ 중간에 어깨·손 힘 풀기',
      '⑥ 약 5분 반복'
    ],
    repsSets: '약 5초 들숨 + 5초 날숨을 편안한 범위에서 반복',
    posture: ['앉아 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '호흡을 억지로 길게 유지하지 않기',
    note: '기존 대표 퀘스트'
  },
  {
    questCode: 'BREATH_05_02',
    title: '5분 카운트 호흡',
    category: 'BREATH_REST',
    duration: 'MIN_5',
    steps: [
      '① 편한 자세 잡기',
      '② 들이쉬며 1~5 세기',
      '③ 내쉬며 1~5 세기',
      '④ 약 4분 반복',
      '⑤ 마지막 1분 자연 호흡으로 마무리'
    ],
    repsSets: '4분 카운트 호흡 + 1분 자연 호흡',
    posture: ['앉아 있음', '서 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '숨 참기 없이 편안한 속도로 수행',
    note: 'NHS의 최소 5분 반복 안내 기반'
  },
  {
    questCode: 'BREATH_05_03',
    title: '바디 릴랙스 브레이크',
    category: 'BREATH_REST',
    duration: 'MIN_5',
    steps: [
      '① 1분 자연 호흡',
      '② 1분 어깨 힘 풀며 천천히 호흡',
      '③ 1분 손·턱 힘 빼기',
      '④ 1분 화면 없이 호흡에 집중',
      '⑤ 마지막 1분 자유롭게 쉬기'
    ],
    repsSets: '1분 × 5단계',
    posture: ['앉아 있음'],
    environment: '조용한 장소 권장',
    guideType: 'GENERAL',
    difficulty: 'LOW',
    caution: '어지럼·불편함이 있으면 호흡 조절 중단',
    note: '단계별 UI에 적합'
  }
]
