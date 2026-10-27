# 🧠 Claude 학습 메모리

> 자동 학습 시작: 2026-05-25

## 📋 최근 작업 패턴

### 2026-05-25 Shop 업로드 자동화 구축
#### 성공 패턴
- 사용한 방법: 
  1. 이미지 드롭존 UI (react-dropzone)
  2. Claude Vision API 연동 (/api/analyze-image)  
  3. Firebase Storage + Database 연동
  4. Flow/Grok 프롬프트 자동 생성
- 핵심 코드: 
  ```typescript
  // Claude Vision API 호출
  const response = await fetch("/api/analyze-image", {
    method: "POST", 
    body: JSON.stringify({image: base64, mimeType})
  })
  ```
- 소요 시간: 예상 2시간 → 실제 3시간

#### 학습 포인트
- **토큰 절약**: 이미지 분석보다 기본 템플릿이 더 효율적
- **카테고리 최적화**: Mathematical Fashion 제거, 실용적 카테고리로 재편
- **UI 단순화**: 복잡한 기능보다 간단한 Save/Reset이 효과적

### 2026-05-25 카테고리 시스템 재편
#### 성공 패턴
- 기존: Street & Modern, Mathematical Fashion, Historical, Fantasy & Armour
- 신규: Street, Uniform, Swimwear, Bodysuit, Spring, Summer, Fall, Winter, Shoes, Socks, Background, Accessories
- 변경 파일: UploadPageContent.tsx, shop-products.ts, ShopPageContent.tsx

#### 학습 포인트
- **실용성 우선**: 사용빈도 높은 카테고리로 집중
- **계절별 분류**: Spring/Summer/Fall/Winter로 시즌 대응
- **아이템별 세분화**: 의류 외에 Shoes, Socks, Accessories 분리

## 🔧 개발된 스킬

### shop-upload-automation
- **기능**: 이미지 → 프롬프트 생성 → Firebase 등록
- **트리거**: 상품 등록 요청시
- **재사용**: ✅ 템플릿 완성, 토큰 절약 버전

### firebase-integration  
- **기능**: addNewProduct, uploadProductImage 연동
- **트리거**: 데이터 저장시
- **재사용**: ✅ 기본 CRUD 패턴

### category-management
- **기능**: 카테고리 시스템 일괄 업데이트  
- **트리거**: 타입 정의 변경시
- **재사용**: ✅ 다중 파일 동기화 패턴

## ⚠️ 해결한 에러들

### TypeScript 모듈 시스템 충돌
- **문제**: `require.main === module` CommonJS vs ES6 import
- **해결**: `main().catch(console.error)` 단순화
- **예방**: ES6 모듈에서는 조건부 실행 피하기

### Firebase Import 에러
- **문제**: uploadProductImage 함수 미정의
- **해결**: 함수 구현 후 정확한 import 경로 설정
- **예방**: 함수 정의 → import → 사용 순서 준수

## 🎯 다음 최적화 대상

1. **스케줄 자동화** - 정기 작업 백그라운드 실행
2. **실시간 대시보드** - 프로젝트 상태 모니터링  
3. **커넥터 연동** - 외부 서비스 통합
4. **성능 메트릭** - 작업 효율성 추적

### 2026-05-25 폐쇄형 학습 루프 시스템 구축
#### 성공 패턴
- 사용한 방법:
  1. claude-loop.md로 학습 규칙 정의
  2. memory.md로 모든 학습 내용 중앙 집중화
  3. claude-system/ 디렉터리 구조 생성
  4. CLAUDE.md에 자동 학습 지시사항 추가
- 핵심 구조:
  ```
  /claude-system/
  ├── skills/            # 자동 생성 스킬
  ├── workflows/         # 반복 작업 자동화  
  └── dashboards/        # 실시간 모니터링
  ```

#### 학습 포인트
- **중앙화된 학습**: 모든 패턴을 memory.md에 집중
- **스킬 자동화**: 성공한 워크플로를 재사용 가능한 스킬로 변환
- **실시간 대시보드**: 프로젝트 상태 한눈에 파악
- **워크플로 자동화**: daily-optimization으로 매일 아침 최적화

### 2026-06-01 Main Page 암호창 'ic' 이동 추가
#### 성공 패턴
- 사용한 방법:
  1. `src/app/page.tsx` 내 `handlePasswordSubmit` 함수 분석
  2. 비밀번호 입력값 'ic' 조건 분기 추가
  3. Next.js `useRouter`의 `router.push('/ic')`를 사용하여 클라이언트 사이드 경로 이동 구현
- 핵심 코드:
  ```typescript
  } else if (password === "ic") {
    router.push("/ic")
  }
  ```

### 2026-06-11 MV 소개 및 다운로드 페이지 추가
#### 성공 패턴
- 사용한 방법:
  1. `src/app/mv/page.tsx` 신규 생성을 통해 유튜브 임베드 및 다운로드 링크 제공.
  2. 코드 최상단에 `MUSIC_VIDEOS` 배열 상수를 관리하기 쉽게 정렬하고 상세 주석을 남겨 사용자가 직접 다운로드 링크를 커스터마이징하기 편리하게 유도.
  3. `lucide-react` 및 `framer-motion`을 조합하여 프리미엄 다크 테마 기반의 모던한 영상 갤러리 디자인 구현.
  4. 루트 페이지 `/` 및 일반 공개 랜딩 `/public`에 `/mv`로 이동하는 링크 및 버튼을 추가하여 접근성 확보.
  5. 암호 입력이 틀렸거나 미인증 방문자일 시 기존 `/public` 안내창 대신 뮤직 비디오(`/mv`) 페이지로 즉시 리다이렉션되도록 라우팅 흐름을 변경.
- 핵심 코드:
  ```typescript
  // src/app/page.tsx
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "oz") {
      router.push("/oz")
    } else if (password === "zo") {
      // ...
    } else {
      // 잘못된/미인증 암호 → 뮤직 비디오 페이지로 바로 이동
      router.push("/mv")
    }
  }
  ```

#### 학습 포인트
- **사용자 커스텀 영역 확보**: 다운로드 링크와 같은 동적 설정 요소를 파일 최상단에 주석과 함께 노출시켜 사용자가 소스 코드에서 바로 편리하게 수정할 수 있게 함.
- **다이렉트 공개 라우팅**: 특별한 인증이 필요 없는 공개 아카이브(뮤직 비디오 등)는 암호 실패 분기에서 바로 랜딩 페이지처럼 연결해 주어, 사용자가 불필요한 단계를 거치지 않고 브랜드의 핵심 미디어를 접할 수 있게 함.
- **디자인 조화**: 기존 RAINSKISS 브랜드의 테마 컬러(Red, Dark) 및 에스테틱과 일치시켜 세련된 분위기를 그대로 계승함.

---
*마지막 업데이트: 2026-06-11 by Antigravity (Learning Loop Active)*
---

## 2026-08-20 작가 연구 + 빛 라이브러리 구축 (Josef Sudek)

### 성공 패턴
- **작가 해부 → 빛 재료 → 스타일 독립** 3단 파이프라인이 처음 완주됨.
  `gaze {작가}` → 4틀 해부 → 그 작가의 빛 원리를 프롬프트 토큰으로 역설계 → 실제 생성 테스트 → **채택된 컷만** 별도 스타일 노트로 분리.
  작가 노트(재료)와 스타일 노트(제품)를 분리한 게 핵심. 작가를 채택 안 해도 재료는 쓸 수 있다.
- **빛 용어를 독립 다이얼 2개로 분해**해서 테스트가 굴러가게 만듦.
  A=경도(그림자 경계, 광원 크기가 결정) / B=명암비(그림자 안쪽, 필이 결정). 이 둘은 독립.
  `hard+flat`(직사 플래시) / `soft+high contrast`(창문 하나, 수덱) 조합이 존재.
  판정은 결과 이미지의 ①그림자 경계 ②그림자 안쪽 두 군데만 본다.
- **시간이 들어간 빛**이 사건 없이 서사를 만든다 — "leaving/arriving rather than static".
  색온도 분리(따뜻한 띠 / 차가운 방)가 명암비 일을 대신해서 검정을 안 뭉개고도 대비가 선다.

### 핵심 코드
```
# 11d — 인물용 확정본 (Typinator `glight2`)
the band leaving the face — low horizontal end-of-day light through an old window
catching only a narrow strip of the subject, one eye and the bridge of the nose lit warm,
the rest of the face and the entire room fallen cold and dark, the strip visibly too
narrow to hold, about to slide off

# 계열 공통 방어 토큰 (생성기가 띠를 넓혀 방 전체를 밝히는 것 방지)
only a narrow band is lit, everything outside the band unlit and cold, no ambient fill
no fill, no reflector, shadows crushed to pure black
```

### 학습 포인트
- **수집 ≠ 채택.** 라이브러리에 노트가 있다고 사장님 작품세계가 아니다. `status: candidate|adopted|rejected` 도입, 진행도는 `수집 N / 채택 M`으로 보고. (수집 4 / 채택 1 — hiromix만 adopted)
- **작가끼리 섞지 말 것.** 내가 수덱 레버를 히로믹스 프롬프트에 이식하려다 제지당함. 각 작가는 독립 완결로 세워두고 **비교·교배는 사장님이 직접**. `## 관련`은 링크만, 내 해석 금지.
- **프롬프트에서 명사는 피사체가 된다.** 히로믹스 프롬프트가 항상 "카메라 든 사진"만 뽑던 원인 = `self-portrait` + 카메라 명사. 카메라를 동사구(`shot on a…`)로 내리고 `no camera visible in frame` + **손을 점유하는 포즈**를 줘야 사라진다. `hands free`만으론 약함.
- 사장님 취향 신호 누적 7개: ①도구 담론 혐오 ②사조 냉소 ③본질 대상 하나 ④결핍 있는 작가 ⑤시간감 있는 빛 ⑥차가운 공간 + 따뜻한 피부 하나 ⑦폭발 직전의 정지.
- 내가 "메모 박아뒀다"고 보고하고 실제로 안 쓴 사고 1건 — 저장 보고는 실제 write 후에만.

### 산출물
- `obsidian/04_System/artists/josef-sudek.md` (신규, candidate)
- `obsidian/04_System/artists/hiromix.md` (status: adopted + 실전 프롬프트 v1/v2 + POSE 9 / SETTING 6)
- `obsidian/04_System/lights/light-library.md` (신규 — 다이얼 이론 + 토큰 전집 1~11, 11a~11d)
- `obsidian/04_System/lights/first-light-band.md` (신규 스타일 — 첫빛 띠)
- `obsidian/04_System/lights/absence-band.md` (신규 스타일 — 부재의 띠, 스타킹 시퀀스 연동)
- `~/.claude/skills/gaze/SKILL.md` (status 규칙 + 교배 금지 규칙 추가)
- 곡 `Pictorial Vs. Photoreal` — https://suno.com/s/mJLKj63sufyU5op7

---

## 2026-09-03 mood — 올리브 시어 캐미 타이사이드 스트링 (스타킹 제외 변형)

### 성공 패턴
- mood 스킬 PANEL C(스타킹+거터)는 **제거가 아니라 교체**가 답. 빈 자리로 두면 5패널 그리드가 무너진다. 이번엔 **타이사이드 코드·태슬 하드웨어 매크로**로 교체 — 의상의 실제 히어로 디테일이라 보드가 더 조여졌다.
- 제외 요청은 프롬프트 삭제만으로 안 된다. **NEGATIVE에 `stockings, tights, hosiery, garter belt, socks` 명시 + GARMENT 본문에 `bare legs, no hosiery of any kind` 긍정문** 2중으로 걸어야 모델이 안 지어낸다.
- 레퍼런스가 플랫 레더 샌들인데 스킬 기본값은 스틸레토 → 기본값을 레퍼런스로 덮고 `stiletto heels, high heels`를 NEGATIVE에 넣어 되돌아오는 걸 막았다.

### 핵심 코드
```
# mood → fit draft 연결: GARMENT 블록(코드블록 3)을 그대로 md의 ## Prompts > Soft (Flow) 본문으로 재사용
node scripts/shop-publish.mjs {slug} --dry   # PLACEHOLDER면 "빈 필드: image"로 정상 차단됨
```

### 학습 포인트
- **"제품 등록"이 곧 publish는 아니다.** 이미지가 대화 첨부로만 오면 `public/shop/`에 파일이 없어 publish 불가 → 모드 A(draft)까지가 끝. 스크립트가 `빈 필드: image`로 막아주는 게 정상 동작이지 실패가 아님. 사장님에게 `_inbox` 투입 안내로 마무리.
- mood 4블록 ↔ fit md 섹션이 1:1로 붙는다: 블록3 GARMENT → Prompts/Soft, 블록1 유리 마네킹 → Prompts 프레이밍, 블록1 POSE → Model Prompt. 다음부터 mood 뽑은 직후 draft 생성은 재작성 없이 이식만 하면 된다.

### 산출물
- `obsidian/04_Products/olive-sheer-cami-tie-side-string.md` (신규, status: draft)

---
*마지막 업데이트: 2026-09-03 by 제갈공명(Claude) — Learning Loop Active*

## [2026-10-26] STUDIO-X 고민 상담소 /studiox
### 성공 패턴: 서버 컴포넌트에서 쿠키(HMAC 서명) 읽어 등급별로 이미지 URL을 골라 HTML에 싣기 — 자격 없는 사람에겐 얼굴판 URL 자체가 안 내려감. RTDB는 Admin SDK로만(클라이언트 규칙 불필요).
### 핵심 코드: src/lib/studiox/{crypto,store}.ts — scrypt 해시, signToken/verifyToken, getViewer()가 매 요청 회원 존재·VVIP 폐기 여부를 DB로 재확인. VVIP 비번 = {passHash, maxEpisode}.
### 학습 포인트: ①새 라우트 만들기 전 `ls src/app/{이름}` 확인 — /x가 이미 있었는데 덮어썼다가 git으로 복구. ②RTDB orderByChild는 .indexOn 규칙 없으면 Admin SDK에서도 에러 → 소규모면 전체 읽고 거르기.
