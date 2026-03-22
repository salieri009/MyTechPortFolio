# User Persona & Design Identity

## 1. 핵심 정체성 (Core Identity)
* **성명**: Jungwook Van (1996년생)
* **현재 상황**: 시드니 UTS(University of Technology Sydney) IT 학부 마지막 학기 재학 중 (2026년 8월 졸업 예정).
* **언어**: 한국어(모국어), 영어, 일본어 활용 가능. 언어별 문맥과 뉘앙스 차이를 잘 이해함.
* **배경**: 통역병 출신으로 정확하고 효율적인 커뮤니케이션을 선호함.

## 2. 전문 기술 스택 및 학업 (Technical & Academic)
* **전공**: Enterprise Software Development (부전공: Computer Graphics and Animation).
* **기술 관심도**: 백엔드, Cloud(AWS), DevOps/MLOps, 데이터 엔지니어링, AI(딥러닝/CNN).
* **진행 중인 프로젝트**: 
  * **Amadeus**: 지능형 인프라 관리 및 이상 탐지 AI 시스템.
  * **CrowdNav**: 시각장애인을 위한 YOLO 기반 실시간 군중 내비게이션.
  * **StevTech 협업**: 대학 프로젝트로 데이터 인제스션 파이프라인 구축 중.
* **목표 자격증**: AWS SAA, CKA(Certified Kubernetes Administrator).

## 3. 관심사 및 라이프스타일 (Interests & Lifestyle)
* **자기관리**: 웨이트 트레이닝 열성팬. 체지방 감량 및 효율적인 루틴 설계에 관심이 많음 (신장 188cm, 체중 107kg).
* **철학**: 하이데거, 칸트 등 동서양 철학에 조예가 깊으며 이를 본인의 개발 철학이나 블로그 글에 녹여냄.
* **서브컬처**: 일본 애니메이션(체인소 맨, 건담, 에반게리온 등), VRChat, 밈(Meme) 문화를 즐김.
* **커리어**: 졸업 후 한국/일본 내 개발자 취업 또는 한국 내 대학원(석/박사) 진학을 고민 중.

## 4. 상호작용 스타일 (Interaction Guidelines)
* **효율성 중심**: 불필요한 서론보다는 명확하고 논리적인 결론을 선호함.
* **위트와 유머**: 적재적소에 사용되는 밈이나 유머러스한 비유를 즐김.
* **지적 자극**: 단순한 답변보다는 기술적, 철학적 통찰이 담긴 깊이 있는 대화를 선호함.
* **성장 지향**: 구체적인 목표(자격증, 프로젝트 성공)를 달성하기 위한 전략적인 조언을 기대함.

---

## 5. Frontend UI/UX Design Strategy (Based on Persona)

### 콘셉트: "Pragmatic Cyber-Philosopher" (실용적 사이버 철학자)
정확하고 효율적인 엔지니어의 면모와, 하이데거를 읽는 철학적 깊이, 에반게리온을 즐기는 오타쿠적 감성을 융합.

1. **테마 & 색상 (Theme & Palette)**
   - **Base**: 다크 라우터/터미널 테마 (Deep Black/Charcoal) - 백엔드/클라우드 개발자의 정체성.
   - **Accent**: 네온 그린/퍼플 (에반게리온 초호기 오마주) 또는 경고/에러 메시지를 연상시키는 강렬한 오렌지/레드.
2. **타이포그래피 (Typography)**
   - **Tech & UI**: Fira Code 나 JetBrains Mono 같은 Monospace 폰트로 IDE 환경 연상.
   - **Philosophy/Blog**: 명조/세리프(Serif) 계열 폰트를 혼용하여 철학적이고 진중한 텍스트의 가독성 극대화.
3. **UI/UX 요소 (UI/UX Elements)**
   - **Hero Section**: CLI 터미널 타이핑 효과로 시작. 통역병 출신답게 한국어/영어/일본어가 랜덤하게 타이핑되며 인사.
   - **RPG Status Board**: 본인의 스펙을 게임 캐릭터 스탯창처럼 표현 (STR: 107kg/188cm, INT: AWS/K8s/AI, Lvl: UTS 4학년).
   - **이스터에그 (Easter Eggs)**: 에러 페이지(404)에 애니메이션 밈이나 VRChat 아바타 활용. 특정 커맨드 입력 시 에반게리온 '비상사태(EMERGENCY)' UI로 테마 변경.
4. **기술적 쇼케이스 (Tech Showcase)**
   - CG/애니메이션 부전공을 살려 Three.js / React Three Fiber 등을 이용한 인터랙티브한 3D 오브젝트(예: 회전하는 쿠버네티스 로고, 혹은 추상적인 기하학 도형) 배치.

---

## 6. 우선순위 고정 (2026-03-22)

현재 프론트엔드 개편은 아래 2개 트랙만 진행한다.

1. **Track 1 - Hero Section 개편**
   - 3개 언어(ko/en/ja) CLI 타이핑 인트로
   - 엔지니어/철학자 정체성을 동시에 전달하는 카피 구조
   - 성능 저하 없이 모바일까지 동작하는 애니메이션 제어

2. **Track 2 - 글로벌 테마/레이아웃 개편**
   - 기본 테마: DevOps Terminal Dark
   - 대체 테마: EVA Emergency Mode (토글 기반)
   - 타이포그래피 2축: Tech(Monospace) + Essay(Serif)

3. **보류 (이번 사이클 제외)**
   - RPG Status Board (기존 3번 항목)

---

## 7. 상세 실행 계획 (Track 1 + 2)

### Phase A. 디자인 토큰 재정의 (Theme Foundation)
- `colors`: terminal 계열 기본 팔레트 + emergency 팔레트 분리
- `typography`: `Fira Code`(UI/Tech), `Noto Serif KR`(Blog/Essay) 역할 분리
- `motion`: 타이핑, fade-in, section reveal의 duration/easing 표준화
- 산출물: 토큰 명세표 + 라이트/다크가 아닌 `mode: dark | eva` 구조

### Phase B. Hero 정보 구조 재설계 (Information Architecture)
- Hero 카피를 3계층으로 분리
  - Line 1: 정체성(Backend/Cloud Engineer)
  - Line 2: 문제해결 키워드(Infra, Data, AI)
  - Line 3: 철학적 태그라인(정체성 차별화)
- 언어 스위치와 충돌하지 않도록 i18n key 계층을 Hero 전용 namespace로 분리
- 산출물: Hero 문안 3개 국어 세트 + 키 이름 규약

### Phase C. Hero 인터랙션 구현 (Track 1)
- CLI 타입 라인 애니메이션 구현 (ko/en/ja 순환)
- 배경은 과한 파티클 대신 저밀도/저연산 추상 오브젝트 사용
- `prefers-reduced-motion` 대응으로 접근성 확보
- 산출물: Hero 컴포넌트 리팩터 + 성능 체크(FPS/CLS)

### Phase D. 글로벌 테마 적용 (Track 2)
- 공통 컴포넌트(Button/Card/Header/Footer) 색상 대비 재정렬
- 토글 UX 문구를 의미 기반으로 변경
  - `Dark` / `EVA` (단순 Light/Dark 제거)
- 404/에러 상태에서 Emergency 테마를 선택적으로 재사용
- 산출물: 전역 스타일 + 테마 스토어 + 핵심 UI 일관성 점검

### Phase E. 검증 및 롤아웃
- viewport 기준: 360 / 768 / 1280 반응형 스냅샷 확인
- 품질 기준
  - 텍스트 대비 WCAG AA 이상
  - Hero 초기 렌더 시 레이아웃 시프트 최소화
  - 애니메이션 비활성 사용자 환경에서 정적 렌더 정상
- 산출물: QA 체크리스트 + 변경 로그

---

## 8. 구현 원칙

- 개인 브랜딩을 위해 "무난함"보다 "의도된 개성"을 우선한다.
- 단, 시각 효과는 성능 예산(모바일 포함) 안에서만 허용한다.
- 테마/타이포/모션은 반드시 토큰 기반으로 관리해 확장 가능성을 유지한다.
