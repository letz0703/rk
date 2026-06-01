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

#### 학습 포인트
- **개발 서버 호환성**: 외부 절대 경로인 `https://rainskiss.com/ic` 대신 Next.js 라우터(`router.push`)를 활용하면 로컬 개발 환경(localhost)과 상용 환경(rainskiss.com) 모두에서 유연하게 이동하므로 개발 효율성이 향상됨.

---
*마지막 업데이트: 2026-06-01 by Antigravity (Learning Loop Active)*