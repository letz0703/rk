#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 [이순신 배포] 로컬 빌드 사전 검증을 시작합니다...${NC}"

# 1. 로컬 빌드 검증 수행
npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo -e "${RED}❌ [검증 실패] 빌드 중 오류가 발생했습니다! 배포를 중단합니다.${NC}"
  echo -e "${YELLOW}코드 오류를 수정한 후 다시 배포를 시도해 주세요.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ [검증 성공] 로컬 빌드 테스트를 통과했습니다!${NC}"

# 2. 커밋 메시지 설정 (인자가 전달되지 않으면 기본 메시지 사용)
COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="chore: automated build verification and deployment [$(date '+%Y-%m-%d %H:%M:%S')]"
fi

# 3. Git 스테이징 및 커밋, 푸시 진행
echo -e "${BLUE}🚀 Git 스테이징 및 푸시를 진행합니다...${NC}"
git add .

# 변경 사항이 있는지 확인
if git diff --cached --quiet; then
  echo -e "${YELLOW}ℹ️ 커밋할 변경 사항이 없습니다.${NC}"
else
  git commit -m "$COMMIT_MSG"
fi

# 푸시 실행
git push

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}🎉 [배포 완료] GitHub 푸시가 완료되었습니다!${NC}"
  echo -e "${BLUE}GitHub Actions 및 Netlify 빌드가 시작됩니다.${NC}"
else
  echo ""
  echo -e "${RED}❌ [푸시 실패] GitHub 푸시 중 오류가 발생했습니다.${NC}"
  exit 1
fi
