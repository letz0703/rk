#!/bin/bash

VAULT_ROOT="$HOME/rk/obsidians"

# 3-Layer + System Architecture 생성
DIRS=(
  "01_Inbox"      # 가공되지 않은 메모, 스크랩
  "02_Notes"      # 원자적 메모 (Zettel)
  "03_Projects"   # 현재 진행 중인 프로젝트별 폴더
  "04_System/Templates" # Obsidian 템플릿
  "04_System/Assets"    # 이미지 및 첨부파일
  "04_System/Scripts"   # 자동화 스크립트
)

for dir in "${DIRS[@]}"; do
  mkdir -p "$VAULT_ROOT/$dir"
done

chmod +x "$VAULT_ROOT/setup_vault.sh"
echo "✅ Obsidian Vault structure initialized at $VAULT_ROOT"