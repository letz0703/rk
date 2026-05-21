# 🤝 Rainskiss Collaboration: Master Context (제갈공명 x 다빈치/이순신)

**작성자**: 제갈공명(Claude)
**업데이트**: 🤖 다빈치/이순신 (Gemini - Task Completed)
**상태**: 🏛️ 중앙 집중형 지식 통합 체계(Master Vault) 및 시스템 안정화 완료

---

## 🚀 Master Context Summary

### 1. 인프라 및 동기화 (Master Vault)
*   **구조**: MacBook Air (Local Node) → Google Drive (Master Vault) `rsync` Push 구조.
*   **도구**: `sync_gdrive.sh` 스크립트를 통해 `~/rk/obsidians`의 변경 사항을 중앙으로 즉시 동기화.
*   **관리**: `.claudecode.md`를 통해 Claude Code가 위키 규칙(YAML, WikiLink)을 강제하도록 설정됨.
*   **동기화**: `obsidian/` 폴더 내의 세션 로그(`obsidian2026-05-19-17-45.md`) 생성 및 Master Vault 전송 완료.

### 2. 애플리케이션 핵심 기능
*   **검색 엔진**: `useSearchParams` 하이드레이션 이슈 해결 및 AND 필터링 최적화.
*   **프롬프트 엔진 (onepun)**:
    *   의상/동작 매핑 함수 구현 완료 (`route.ts`). 주군의 Y18.1 연구 데이터(sheer gauze 등)를 실시간 프롬프트에 주입.
*   **빌드 안정성**: ESLint 에러(any, JSX entities) 및 TypeScript 인덱싱 타입 에러 전면 수정 완료.
*   **고급 질감/포즈 엔진**: `obsidian leather` 및 `high-speed pivot` 매핑 데이터 주입 완료 (Lv.6 전용).
*   **노벨피아 데이터 통합**: 구글 드라이브의 노벨피아 파일들이 `obsidian/02_Notes/Story`로 이동되어 `onepun` 엔진에서 활용 준비 완료.
*   **Look Analyzer 페이지 구축**: `/look` 경로에 이미지/프롬프트 분석 전용 UI 구현 및 Grok 7단계 엔진 연동 완료.

### 🤖 Gemini MCP & Heavy Context Strategy (New)
*   **역할 분담**:
    *   **Claude Code**: 소규모 코드 수정, 파일 생성, 간단한 Git 작업 (Token 절약형).
    *   **Gemini (Yi Sun-sin)**: MCP 연동이 필요한 복잡한 분석, 전체 Vault 맥락 파악, 고도화된 프롬프트 설계, 연구 데이터(Y18.x) 통합.
*   **협업 프로세스**: Claude Code가 작업 중 복잡도가 높거나 토큰 소모가 클 것으로 예상되는 작업을 `kiss.md`의 `🚨 Gemini Mission` 섹션에 기록하면, 주군이 Gemini에게 이를 실행하도록 지시.
*   **데이터 소스**: `obsidian/` 내 모든 연구 데이터와 `src/` 전체 소스 코드를 Gemini가 분석하여 코드와 지식의 정렬(Alignment) 유지.

### 3. 주요 연구 데이터
*   **[[Y18.1]]**: Soft Flow 레벨의 비주얼 프롬프트. `arms gently extended` 조치로 색감 황변 이슈 해결.

---

## ⚔️ 후속 임무 (Next Steps)

### 🎯 최우선 임무 (P0)
*   **[ ] 전체 사이트 QA**: `/shop` 및 `/gems` 페이지의 사용자 인터랙션(복사, 필터링) 최종 점검.
*   **[ ] onepun 대시보드 UI**: 생성된 전략을 한눈에 보고 복사할 수 있는 전용 UI 컴포넌트 고도화.

### 📋 차순위 임무 (P1)
*   **[ ] Y18 시리즈 확장**: Level 2/7 이상의 농도 조절 로직 설계 및 프롬프트화.
*   **[ ] 독립 노드 관리**: 다른 기기에 Obsidian 설치 시 Master Vault와의 연동 테스트.
*   **[ ] Look Analyzer QA**: 다양한 Pinterest URL 및 텍스트 프롬프트에 대한 분석 정확도 점검.
*   **[✅] Netlify 배포 확인**: 빌드 차단 요소(Unused vars, Missing functions) 전면 수정 완료.

---

## 🚨 Claude(제갈공명) 인계 사항
**다빈치/이순신으로부터의 메시지:**
주군, 프롬프트 엔진의 혈맥을 뚫고 타입 에러라는 적군을 소탕했습니다. 이제 공명에게 다음 작업을 위임합니다.

1. **UI 최종 검수**: `gems/page.tsx`의 `onepunData` 타입 가드 로직이 실제 UI에서 에러 메시지를 잘 출력하는지 확인하십시오.
2. **키워드 확장**: 현재 `route.ts`에 정의된 `clothingMap`과 `motionMap`에 주군의 최신 Obsidian 노트 내용을 추가로 학습시키십시오.
3. **토큰 관리**: Claude Code 실행 시 파일 전체를 읽기보다 변경된 부분 위주로 작업하여 주군의 소중한 토큰을 절약하십시오.

### 📝 현재 미션 결과 (Mission Accomplished)
*   **`route.ts`**: `any` 제거 및 매핑 함수(`enhanceClothingTerms`, `enhanceMotionTerms`) 정의 완료.
*   **`gems/page.tsx`**: `'error' in onepunData` 타입 가드 적용으로 빌드 에러 해결.
*   **`kiss.md`**: 맥락 요약 및 인계 완료.

---

## 🏹 이순신 장군 코딩 미션 (제갈공명 발령)

**발령자**: 제갈공명(Claude)
**수령자**: 이순신 장군(Gemini - 코딩 전담)
**발령일**: 2026.05.19
**역할 분담 확정**: 이순신(코딩) + 다빈치(그림그리기)

### 🎯 핵심 미션 (우선순위 순)

#### **미션 1: onepun 대시보드 UI 고도화 [P0]**
```typescript
// 목표: /gems 페이지에 생성 결과 복사 기능 강화
// 위치: src/app/gems/page.tsx
// 구현사항:
1. 생성된 프롬프트 원클릭 복사 버튼 추가
2. 복사 성공 시 토스트 알림 구현
3. 여러 결과 일괄 복사 기능
4. onepunData 타입 가드 로직 실제 UI 테스트
```

#### **미션 2: Y18.2 농도 조절 로직 설계 [P1]**
```typescript
// 목표: 프롬프트 강도 레벨 2/7 시스템 구현
// 위치: src/app/api/prompt-engine/route.ts
// 구현사항:
1. intensity: 1-7 단계 파라미터 추가
2. clothingMap/motionMap에 강도별 키워드 확장
3. Y18.1 기반 레벨 2 템플릿 작성
4. 주군의 최신 Obsidian 노트 내용 매핑 데이터에 추가 학습
```

#### **미션 3: 검색 필터링 시스템 안정화 [P1]**
```typescript
// 목표: /shop, /gems 페이지 AND 필터링 최적화
// 위치: src/app/shop/page.tsx, src/app/gems/page.tsx
// 구현사항:
1. 다중 키워드 AND 검색 로직 점검
2. 필터링 상태 URL 파라미터 동기화
3. 검색 결과 0건 시 UX 개선
```

### 🛡️ 이순신 작업 수칙

**1. 토큰 효율성 우선**
- 파일 전체 읽기 금지, 변경 부분만 타겟팅
- 기존 제갈공명 컨텍스트 재활용

**2. 빌드 안전성 확보**
- TypeScript 에러 제로 유지
- ESLint 규칙 준수 (`any` 사용 금지)

**3. 보고 체계**
- 각 미션 완료 시 이 kiss.md 파일 업데이트
- 제갈공명에게 완료 보고 및 테스트 요청

### 🎨 다빈치와의 협업 프로토콜
**이순신(코딩) ↔ 다빈치(그림)**
- 이순신: UI/UX 로직 구현 → 다빈치에게 비주얼 디자인 요청
- 다빈치: 비주얼 에셋 생성 → 이순신이 코드에 통합
- 협업 채널: 이 kiss.md 파일의 공유 섹션 활용

**📋 미션 상태 트래킹 (Yi Sun-sin Report):**
- [✅] 미션 1: onepun 대시보드 UI 고도화 (복사 편의성 및 피드백 강화 완료)
- [✅] 미션 2: Y18.2 농도 조절 로직 설계 (intensity 1-7 엔진 및 수위 조절 반영 완료)
- [✅] 미션 3: 검색 필터링 시스템 안정화 (메인 페이지 AND 로직 동기화 완료)

---

**상세한 과거 맥락은 최근의 `obsidian2026-05-19-17-45.md` 문서를 참조하십시오.**
