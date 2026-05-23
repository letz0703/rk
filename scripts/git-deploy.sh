#!/bin/bash

# Git 배포 단축 스크립트 - "git 배포" 명령어 지원
# 사용법: ./scripts/git-deploy.sh [커밋메시지]

echo "🔥 안전한 Git 배포를 시작합니다..."
echo ""

# 기존 deploy.sh 실행
./scripts/deploy.sh "$1"