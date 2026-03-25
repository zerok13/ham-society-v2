//
// HAM Society Data - 대한혈관외과학회 혈액투석길 연구회

export interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
  isNew: boolean;
  category: "공지" | "안내" | "소식";
  priority: "중요" | "일반" | "긴급";
  image?: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  time: string;
  description: string;
  isUpcoming: boolean;
  type: "정기 학술대회" | "세미나" | "워크샵";
}

export interface Executive {
  id: number;
  name: string;
  position: string;
  affiliation: string;
  role: string;
  phone?: string;
  email?: string;
  image?: string;
}

export interface HistoryItem {
  year: string;
  month?: string;
  events: string[];
}

// 공지사항 데이터
export const notices: Notice[] = [
  {
    id: 4,
    title: "[공지] 제 10회 대한혈관외과학회 혈액투석길 연구회 개최 안내 (The 10th KSVS HAM)",
    date: "2026.03.24",
    content: `제 10회 대한혈관외과학회 혈액투석길 연구회를 아래와 같이 개최하오니 많은 참석 바랍니다.

■ 행사명: 제 10회 대한혈관외과학회 혈액투석길 연구회
           (The 10th KSVS Hemodialysis Access Meeting, HAM)
■ 일  시: 2026년 04월 26일 (일) 15:00 ~ 18:30
■ 장  소: 대전 충남대학교 병원 본관 2층 고위과정 강의실


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   학술대회 프로그램
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶ 등록 및 개회
  14:50 ~ 15:00  Registration & Opening Remarks

▶ Session 1. Discussion of Interesting Cases
  좌장: 유창현 (유창현외과), 안문상 (충남대병원)
  (발표 5분, Discussion 5분)

  15:00 ~ 15:10  Case 1.  박재영 (베스트) — 박재영 (도담외과)
  15:10 ~ 15:20  Case 2.  김동현 (워스트) — 김동현 (해운대도담외과)
  15:20 ~ 15:30  Case 3.  김원종 (베스트) — 김원종 (수원도담외과)
  15:30 ~ 15:40  Case 4.  문진호 (베스트) — 문진호 (유창현외과)
  15:40 ~ 15:50  Case 5.  김형태 (워스트) — 김형태 (브이외과)
  15:50 ~ 16:00  Case 6.  변승재 (워스트) — 변승재 (청맥병원)
  16:00 ~ 16:10  Case 7.  권준성 (베스트) — 권준성 (춘천성심병원)
  16:10 ~ 16:20  Case 8.  김영화 (베스트) — 김영화 (서울선정형외과)
  16:20 ~ 16:30  Case 9.  정병훈 (워스트) — 정병훈 (JB외과)
  16:30 ~ 16:40  Case 10. 이순천 (워스트) — 이순천 (광양사랑병원)

  16:40 ~ 16:50  Break Time

▶ Session 2. Discussion of Complex Cases
  좌장: 박제훈 (오른외과), 이순천 (광양사랑병원)
  (발표 5분, Discussion 5분)

  16:50 ~ 17:00  Case 1.  김영균 (워스트) — 김영균 (세이브외과)
  17:00 ~ 17:10  Case 2.  박제훈 (베스트) — 박제훈 (오른외과)
  17:10 ~ 17:20  Case 3.  김대환 (워스트) — 김대환 (나은길외과)
  17:20 ~ 17:30  Case 4.  박근명 (워스트) — 박근명 (인천외과)
  17:30 ~ 17:40  Case 5.  김현규 (워스트) — 김현규 (이담외과)
  17:40 ~ 17:50  Case 6.  김송이 (베스트) — 김송이 (세종충남대병원)
  17:50 ~ 18:00  Case 7.  고진  (워스트) — 고진 (고하이외과)
  18:00 ~ 18:10  Case 8.  최찬중 (워스트) — 최찬중 (초이스외과)
  18:10 ~ 18:20  Case 9.  윤우성 (워스트) — 윤우성 (루백외과)
  18:20 ~ 18:30  Case 10. 이재훈 (베스트) — 이재훈 (대구가톨릭대학교 병원)

▶ 폐회 및 만찬
  18:30          Closing Remarks & Dinner — 김형태 회장 (브이외과)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

※ 참가 신청 및 문의: 사무국 (zerok13@gmail.com / 010-2688-5625)

많은 관심과 참여 부탁드립니다.`,
    isNew: true,
    category: "공지",
    priority: "중요",
    image: "/notice-10th-conference.jpg",
  },
  {
    id: 1,
    title: "[공지] 제 9회 대한혈관외과학회 혈액투석길 연구회 개최 안내",
    date: "2026.01.25",
    content: "제 9회 대한혈관외과학회 혈액투석길 연구회가 2026년 1월 25일 대구가톨릭대학교 의과대학 (루가관) 7층 강당에서 개최됩니다.",
    isNew: false,
    category: "공지",
    priority: "긴급",
  },
  {
    id: 2,
    title: "[소식] 홈페이지 오픈",
    date: "2026.01.12",
    content: "대한혈관외과학회 혈액투석길 연구회 공식 홈페이지가 오픈되었습니다. 많은 이용 부탁드립니다.",
    isNew: false,
    category: "소식",
    priority: "일반",
  },
  {
    id: 3,
    title: "[안내] 신규 회원 가입 안내",
    date: "2026.01.03",
    content: "대한혈관외과학회 회원으로서 혈액투석길 연구회 가입을 원하시는 분은 사무국으로 문의해 주시기 바랍니다.",
    isNew: false,
    category: "안내",
    priority: "중요",
  },
];

// 학술행사 일정
export const events: Event[] = [
  {
    id: 10,
    title: "제 10회 대한혈관외과학회 혈액투석길 연구회 (The 10th KSVS HAM)",
    date: "2026.04.26",
    location: "대전 충남대학교 병원 본관 2층 고위과정 강의실",
    time: "15:00 ~ 18:30 (등록 14:50)",
    description: "제 10회 대한혈관외과학회 혈액투석길 연구회 (The 10th KSVS Hemodialysis Access Meeting, HAM)\n\nSession 1. Discussion of Interesting Cases\n좌장: 유창현 (유창현외과), 안문상 (충남대병원)\n\nSession 2. Discussion of Complex Cases\n좌장: 박제훈 (오른외과), 이순천 (광양사랑병원)\n\n각 세션은 10개의 케이스 발표 (발표 5분 + 토론 5분) 로 구성됩니다.",
    isUpcoming: true,
    type: "정기 학술대회",
  },
  {
    id: 9,

    title: "제 9회 대한혈관외과학회 혈액투석길 연구회",
    date: "2026.01.25",
    location: "대구가톨릭대학교 의과대학 (루가관) 7층 강당",
    time: "8:55 ~ 16:00",
    description: "제9회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 8,
    title: "제 8회 대한혈관외과학회 혈액투석길 연구회",
    date: "2025.07.05",
    location: "순천만 생태문화 교육원 공연장",
    time: "15:00 ~ 18:30",
    description: "제8회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 7,
    title: "제 7회 대한혈관외과학회 혈액투석길 연구회",
    date: "2025.02.08",
    location: "부산역 아스티호텔 22층 그랜드 볼",
    time: "종일",
    description: "제7회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 6,
    title: "제 6회 대한혈관외과학회 혈액투석길 연구회",
    date: "2024.11.23",
    location: "라마다플라자 광주호텔",
    time: "종일",
    description: "제6회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 5,
    title: "제 5회 대한혈관외과학회 혈액투석길 연구회",
    date: "2024.06.22",
    location: "호텔 페이토 강남",
    time: "종일",
    description: "제5회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 4,
    title: "제 4회 대한혈관외과학회 혈액투석길 연구회",
    date: "2024.02.17",
    location: "부산역 아스티호텔 22층 그랜드 볼",
    time: "종일",
    description: "제4회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 3,
    title: "제 3회 대한혈관외과학회 혈액투석길 연구회",
    date: "2023.07.08",
    location: "호텔 수성 (대구 수성구 용학로 10)",
    time: "종일",
    description: "제3회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 2,
    title: "제 2회 대한혈관외과학회 혈액투석길 연구회",
    date: "2023.02.18",
    location: "홀리데이인 인천 송도 2층 미팅룸",
    time: "종일",
    description: "제2회 HAM 정기 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
  {
    id: 1,
    title: "제 1회 대한혈관외과학회 혈액투석길 연구회",
    date: "2022.09.03",
    location: "세이브외과의원 (대전 중구)",
    time: "종일",
    description: "제1회 HAM 창립 학술대회",
    isUpcoming: false,
    type: "정기 학술대회",
  },
];

// 임원진 명단
export const executives: Executive[] = [
  {
    id: 1,
    name: "김형태",
    position: "회장",
    affiliation: "브이외과",
    role: "연구회 총괄",
    phone: "010-3338-6346",
    email: "morphus.kht@gmail.com",
  },
  {
    id: 2,
    name: "변승재",
    position: "총무",
    affiliation: "청맥외과",
    role: "연구회 운영 총괄",
    phone: "010-8642-2622",
    email: "polarisking@hanmail.net",
  },
  {
    id: 3,
    name: "이순천",
    position: "회계 감사",
    affiliation: "광양사랑병원",
    role: "회계 및 감사",
    phone: "010-8605-7692",
    email: "drsclee@hanmail.net",
  },
  {
    id: 4,
    name: "윤우성",
    position: "학술",
    affiliation: "루백외과",
    role: "학술 활동 담당",
    phone: "010-9685-0618",
    email: "wsyun@me.com",
  },
  {
    id: 5,
    name: "김영균",
    position: "간사1",
    affiliation: "세이브외과",
    role: "사무국 운영",
    phone: "010-2688-5625",
    email: "zerok13@gmail.com",
  },
  {
    id: 6,
    name: "권준성",
    position: "간사2",
    affiliation: "춘천성심병원",
    role: "사무국 지원",
    phone: "010-9185-6823",
    email: "kahara97@naver.com",
  },
  {
    id: 7,
    name: "고진",
    position: "전산 위원",
    affiliation: "고하이외과",
    role: "전산 시스템 관리",
    phone: "010-5261-5314",
    email: "forgene@naver.com",
  },
  {
    id: 8,
    name: "이재훈",
    position: "간사3",
    affiliation: "대구가톨릭대학교",
    role: "사무국 운영 지원",
    phone: "010-8927-4464",
    email: "vsljh@cu.ac.kr",
  },
];

// 연혁
export const history: HistoryItem[] = [
  {
    year: "2026",
    events: [
      "제 9회 대한혈관외과학회 혈액투석길 연구회 개최 (1월, 대구)",
      "제 10회 대한혈관외과학회 혈액투석길 연구회 개최 예정 (4월, 대전)",
    ],
  },
  {
    year: "2025",
    events: [
      "대한혈관외과학회 혈액투석길 연구회로 공식 승인",
      "제 7회 혈액투석길 연구회 개최 (2월, 부산)",
      "제 8회 혈액투석길 연구회 개최 (7월, 순천만)",
    ],
  },
  {
    year: "2024",
    events: [
      "제 4회 혈액투석길 연구회 개최 (2월, 부산)",
      "제 5회 혈액투석길 연구회 개최 (6월, 서울 강남)",
      "제 6회 혈액투석길 연구회 개최 (11월, 광주)",
    ],
  },
  {
    year: "2023",
    events: [
      "제 2회 혈액투석길 연구회 개최 (2월, 인천 송도)",
      "제 3회 혈액투석길 연구회 개최 (7월, 대구)",
    ],
  },
  {
    year: "2022",
    month: "09월",
    events: [
      "제 1회 혈액투석길 연구회 창립 및 개최 (대전 세이브외과)",
      "혈액투석길 연구회 설립",
    ],
  },
];

// 연구회 소개 정보
export const aboutInfo = {
  greeting: `안녕하십니까.

대한혈관외과학회 혈액투석길 연구회(HAM)를 방문해 주셔서 감사합니다.

혈액투석길 연구회는 투석 환자의 혈관 접근로(Vascular Access)에 관한 학술 연구와 임상 경험을 공유하고, 관련 분야의 발전을 도모하기 위해 설립되었습니다.

2022년 9월 창립 이래, 연 2회 정기 학술대회를 개최하며 회원들 간의 학술 교류와 협력을 이어가고 있습니다. 2025년에는 대한혈관외과학회의 공식 연구회로 승인받아 더욱 체계적인 활동을 펼치고 있습니다.

앞으로도 회원 여러분의 많은 관심과 참여를 부탁드립니다.

감사합니다.`,

  purpose: "혈액투석길 연구회는 투석 환자의 혈관 접근로(Vascular Access)에 관한 학술 연구와 임상 경험을 공유하고, 관련 분야의 발전을 도모하기 위해 설립되었습니다.",

  activities: {
    academic: [
      "연 2회 정기 학술대회 개최",
      "비정기적 세미나 및 워크샵",
      "국내외 학술 교류 및 협력",
    ],
    research: [
      "다기관 공동 임상 연구 수행",
      "투석혈관 접근로 관련 데이터베이스 구축",
      "연구 과제 지원 및 관리",
    ],
    education: [
      "의료진 대상 교육 프로그램 운영",
      "술기 교육 및 실습 과정",
      "온라인 교육 콘텐츠 개발",
    ],
    guidelines: [
      "국내 실정에 맞는 진료 가이드라인 제정",
      "표준 치료 프로토콜 개발",
      "질 향상 활동 지원",
    ],
  },

  programs: [
    {
      title: "정기 학술대회",
      description: "연 2회 개최되는 정기 학술대회를 통해 최신 연구 성과를 공유하고 학술 교류의 장을 마련합니다.",
    },
    {
      title: "세미나",
      description: "비정기적인 세미나를 통해 투석 혈관 접근로 관련 최신 지식과 술기를 습득하고 서로의 경험을 공유할 수 있습니다.",
    },
  ],

  membershipInfo: `대한혈관외과학회 회원으로서 혈액투석길 연구회 가입을 원하시는 분은 사무국으로 문의해 주시기 바랍니다.

이메일: zerok13@gmail.com
전화: 010-2688-5625
팩스: 042-536-7778`,
};

// 사무국 연락처
export const contactInfo = {
  name: "대한혈관외과 혈액투석길 연구회 사무국",
  email: "zerok13@gmail.com",
  phone: "010-2688-5625",
  fax: "042-536-7778",
  address: "대전 중구 계룡로 832 중도일보 2층 세이브외과",
};

// 갤러리 이미지
export const galleryImages = [
  {
    id: 1,
    src: "/slide-group-winter.jpg",
    title: "제9회 학술대회 단체사진",
    date: "2026.01.25",
  },
  {
    id: 2,
    src: "/slide-group-suncheon.jpg",
    title: "제8회 학술대회 단체사진",
    date: "2025.07.05",
  },
  {
    id: 3,
    src: "/slide-panel.jpg",
    title: "제9회 학술대회 좌장세션",
    date: "2026.01.25",
  },
  {
    id: 4,
    src: "/slide-av-study.jpg",
    title: "제1회 학술대회",
    date: "2022.09.03",
  },
];
export const resources = [
  {
    id: 1,
    title: "혈액투석 관련 학술 발표 자료 01",
    date: "2026-03-20",
    category: "발표자료",
    fileSize: "2.5MB"
  },
  // ... 추가 데이터
];