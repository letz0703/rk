#!/bin/bash
# ⛔ 폐기됨 — 2026-08-07
#
# 이 스크립트는 obsidian vault를 *평문*으로 Google Drive에 업로드했다.
# vault에 야한 프롬프트가 다수 있어, 구글 자동 스캔에 걸리면
# icanmart@gmail.com 계정이 정지될 수 있다 → Drive·Gmail·YouTube 동반 사망.
#
# 대체: ~/vault_seal.sh
#   - AES-256 .7z 로 봉인 (-mhe=on 이라 파일명까지 안 보임)
#   - 대상: obsidian + .claude/skills(gstack 제외) + .claude/projects, 약 32MB
#   - 복원: 7zz x rk-vault-<날짜>.7z -o<경로>

cat <<'EOF'
⛔ sync_gdrive.sh 는 폐기됐습니다.

이 스크립트는 vault를 평문으로 Google Drive에 올립니다.
야한 프롬프트가 구글 스캔에 노출되어 계정 정지 위험이 있습니다.

대신 사용하세요:

    ~/vault_seal.sh

(암호화 백업 — 내용도 파일명도 구글이 못 봅니다)
EOF

exit 1

# ── 원본 보존 (실행되지 않음) ────────────────────────────────
# VAULT_PATH="/Users/changmankim/projects/rk/obsidian"
# GDRIVE_LOCAL_ROOT=$(ls -d $HOME/Library/CloudStorage/GoogleDrive-* 2>/dev/null | head -n 1)
# MAIN_VAULT_PATH="$GDRIVE_LOCAL_ROOT/My Drive/obsidian_vault"
# rsync -avz --delete --timeout=30 --contimeout=10 \
#     --exclude ".obsidian/workspace*" \
#     --exclude ".obsidian/cache*" \
#     --exclude ".DS_Store" \
#     "$VAULT_PATH/" "$MAIN_VAULT_PATH/"
