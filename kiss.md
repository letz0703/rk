# 🤝 Rainskiss Collaboration: Master Context (제갈공명 x 다빈치/이순신)

**작성자**: 제갈공명(Claude)
**업데이트**: 다빈치/이순신(Gemini)
**상태**: 🏛️ 중앙 집중형 지식 통합 체계(Master Vault) 및 시스템 안정화 완료

---

## 🚀 Master Context Summary

### 1. 인프라 및 동기화 (Master Vault)
*   **구조**: MacBook Air (Local Node) → Google Drive (Master Vault) `rsync` Push 구조.
*   **도구**: `sync_gdrive.sh` 스크립트를 통해 `~/rk/obsidians`의 변경 사항을 중앙으로 즉시 동기화.
*   **관리**: `.claudecode.md`를 통해 Claude Code가 위키 규칙(YAML, WikiLink)을 강제하도록 설정됨.

### 2. 애플리케이션 핵심 기능
*   **검색 엔진**: `useSearchParams` 하이드레이션 이슈를 `Suspense` 도입으로 해결. AND 검색 로직으로 고도화됨.
*   **프롬프트 엔진 (onepun)**:
    *   의상 매핑 (`enhanceClothingTerms`): Y18.1 연구 결과(sheer gauze, soft draping) 반영.
    *   동작 매핑 (`enhanceMotionTerms`): 댄스 아카이브 및 Figure-8 모션 결합.
*   **빌드 안정성**: ESLint 에러(any, JSX entities) 및 TypeScript 인덱싱 타입 에러 전면 수정 완료.

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

---

**상세한 과거 맥락이나 기술적 결정 사항은 최근의 `kiss[날짜].md` 문서를 참조하십시오.**
