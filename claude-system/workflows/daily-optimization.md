# Daily Optimization Workflow

## 매일 아침 자동 실행

### 1. 프로젝트 상태 체크
- Git 상태 확인
- 빌드 에러 여부 
- Firebase 연결 상태
- 환경변수 유효성

### 2. Memory 분석
- 어제 작업 패턴 요약
- 반복되는 에러 패턴 식별
- 새로운 스킬 생성 가능성 체크

### 3. 최적화 제안
- 비효율적 워크플로 개선
- 자주 사용하는 작업의 자동화 기회
- 에러 예방 체크리스트 업데이트

### 4. 오늘 작업 준비
- 관련 스킬 파일 준비
- 필요한 환경 설정 확인
- 예상 작업시간 추정

## 실행 트리거

```bash
# 매일 오전 9시 자동 실행 (스케줄러)
/schedule daily 09:00 "daily optimization check"
```

## 출력 형태

```markdown
## 📊 Daily Report - [날짜]

### ✅ 시스템 상태
- Build: OK/ERROR
- Firebase: Connected
- Git: Clean/Modified

### 🧠 Learning Summary  
- 어제 생성된 스킬: [개수]
- 해결된 에러: [개수]
- 시간 절약: [예상값]

### 🎯 Today's Focus
- [우선순위 작업]
- [주의사항]
- [사용할 스킬]
```