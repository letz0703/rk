#!/bin/bash

VAULT_PATH="/Users/changmankim/projects/rk/obsidian"
# 구글 드라이브 데스크탑 앱의 로컬 경로 (사용자 환경에 맞춰 자동 탐색)
GDRIVE_LOCAL_ROOT=$(ls -d $HOME/Library/CloudStorage/GoogleDrive-* 2>/dev/null | head -n 1)
# 구글 드라이브 내의 메인 통합 Vault 경로
MAIN_VAULT_PATH="$GDRIVE_LOCAL_ROOT/My Drive/obsidian_vault"

if [ -z "$GDRIVE_LOCAL_ROOT" ]; then
    echo "❌ 로컬 구글 드라이브 경로를 찾을 수 없습니다. 앱이 실행 중인지 확인하세요."
    exit 1
fi

echo "🚀 MacBook Air 자료를 메인 Vault(Google Drive)로 전달 중..."
echo "📤 Local Source: $VAULT_PATH"
echo "📥 Main Target: $MAIN_VAULT_PATH"

mkdir -p "$MAIN_VAULT_PATH"

# --delete 옵션을 유지하여 로컬에서 정리된 상태를 메인에 그대로 반영 (통합 전략)
# Google Drive 스트리밍 지연 대응: 타임아웃 및 재시도 설정
rsync -avz --delete --timeout=30 --contimeout=10 \
    --exclude ".obsidian/workspace*" \
    --exclude ".obsidian/cache*" \
    --exclude ".DS_Store" \
    "$VAULT_PATH/" "$MAIN_VAULT_PATH/"

if [ $? -ne 0 ]; then
    echo "⚠️  일부 파일 전송 실패 (Google Drive 동기화 지연). 재시도 권장."
    echo "🔄 수동 재실행: ./sync_gdrive.sh"
else
    echo "✅ 완벽 동기화 완료!"
fi

echo "✅ 메인 Vault로 전달 완료! 구글 드라이브를 통해 통합 저장됩니다."