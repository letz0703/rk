# CLAUDE.md

File provides guidance to Claude Code (claude.ai/code) when working with code in repository.

> [!IMPORTANT]
> **디렉터리 스캔 최적화**: 코드베이스의 라우트 및 폴더 구조를 매번 파악하여 토큰을 낭비하지 마십시오. 새로운 작업 시작 시 [codebase_guide.md](file:///Users/changmankim/projects/rk/obsidian/04_System/codebase_guide.md) 파일을 먼저 확인하여 구조를 파악하세요.

## **🚨 MANDATORY CODE VERIFICATION PROTOCOL**

**CRITICAL REQUIREMENT**: After ANY code modification, you MUST verify actual functionality before reporting completion.

### Required Actions

1. **Start dev server**: `bun run dev-only` or `bun dev`
2. **Test actual functionality**: Use browser, API calls, or nextjs testing
3. **Verify specific changes work**: Not just "no errors" - actual feature works
4. **For UI changes**: Visual confirmation in browser required
5. **For API/logic changes**: Test actual behavior with curl/requests

### Never Report Complete Without

- ✅ Server running successfully
- ✅ Modified functionality tested and working
- ✅ No regression in existing features

**This is non-negotiable. Code without verification = incomplete work.**

---

## Project Overview

**rainskiss** is Next.js multimedia content platform for music, AI-powered creative tools, pose references. Integrates Firebase (auth, database, storage), Anthropic Claude API, Google Gemini.

## Commands

```bash
bun dev        # Start development server
bun build      # Production build
bun start      # Start production server
bun lint       # Run ESLint (next lint)
```

No test suite configured. Use `ts-node` to run one-off TypeScript scripts (e.g., `src/api/` uploaders).

## Environment Variables

```
NEXT_PUBLIC_FIREBASE_*    # Firebase project config
NEXT_PUBLIC_ADMIN_UID     # UID with admin privileges
NEXT_PUBLIC_GEMINI_API_KEY
ANTHROPIC_API_KEY
```

## Architecture

### App Router Structure

`src/app/` uses Next.js 13+ App Router. Server Components by default; add `"use client"` only for interactivity. API routes live in `src/app/api/`.

Key routes:
- `/mix` — Mix Advisor (Claude vision model analyzes DAW screenshots)
- `/prompts` — Fuzzy-searchable prompt library (Fuse.js)
- `/shop` — Product shop backed by Firebase
- `/pose` — Pose reference gallery with dynamic routing
- `/letters` — Firebase-backed user message submission

### Auth Flow

`AuthContextProvider` wraps root layout, provides Google OAuth state via Firebase. Consume with `useAuthContext()`. Admin checks use `NEXT_PUBLIC_ADMIN_UID` comparison.

### Data & API Flow

- **Firebase Realtime Database** — products, prompts, letters
- **Cloudinary** (`next-cloudinary`) — image uploads, serving
- **`/api/mix-chat`** — Next.js API route proxying requests to Anthropic Claude API with system prompt for audio engineering expertise

### Component Conventions

- UI primitives from shadcn/ui (Radix UI + CVA variants) in `src/components/ui/`
- Class composition with `clsx` + `tailwind-merge` via `cn()` helper
- Path alias `@/` maps to `src/`

### Key Files

- `src/api/firebase.js` — all Firebase operations (CRUD for products, prompts, letters)
- `src/components/AuthContext.tsx` — auth state provider
- `src/app/api/mix-chat/route.ts` — Anthropic API proxy
- `tailwind.config.ts` — custom color variables, theme
- `components.json` — shadcn/ui config (new-york style, RSC enabled)

## Closed-Loop Learning System

**ACTIVE**: 폐쇄형 학습 루프 시스템이 활성화되어 있습니다.

### 작업 완료 후 자동 기록
모든 작업 완료시 다음을 `memory.md`에 자동 추가:
```markdown
## [날짜] 작업명
### 성공 패턴: [재사용 가능한 방법]
### 핵심 코드: [중요한 코드 스니펫]  
### 학습 포인트: [다음에 개선할 점]
```

### 에러 해결 후 기록
문제 해결시 `memory.md`에 추가:
```markdown
## [날짜] 에러 해결
### 문제: [간단한 설명]
### 해결: [구체적 방법]  
### 예방: [재발 방지책]
```

### 스킬 자동 생성
- 재사용 가능한 워크플로는 `claude-system/skills/`에 저장
- 복잡한 작업 성공시 자동으로 스킬 문서 생성
- 다음 유사 작업시 기존 스킬 먼저 확인

### 학습 기반 최적화
- 작업 시작 전 `memory.md`와 관련 스킬 확인
- 이전 실패 패턴 회피
- 성공 패턴 우선 적용

## Session Continuity

**IMPORTANT**: At start of new conversation or after `/clear`, **triggered by `higem` command**, read `kiss.md` and the latest `obsidian/03_Projects/kiss[YYYY-MM-DD]-*.md` archive to understand current project state, ongoing work handoffs between AI collaborators (제갈공명=Claude 판단·실행 / 조조=Grok HARD / 2순신=Gemini Gem 리서치).

Session cycle: `higem` (restore) → work → `packgem` (checkpoint) → `byec` (archive + encrypted backup) → `/clear`.

## AI-to-AI Collaboration Protocol

When complex questions requiring research arise:

1. **Claude's Role (제갈공명)**: Decision-maker, executor

   - Read latest kiss.md for context
   - Delegate research tasks to Gemini
   - Execute final decisions based on Gemini's reports

2. **Gemini's Role (다빈치/이순신)**: Research, analysis

   - Scan Google Drive documents
   - Analyze Obsidian vault content
   - Review kiss*.md history
   - Write structured reports to kiss.md

3. **kiss.md Format**: Research reports follow this structure:

   ```markdown
   ## 📋 [Date] Gemini Research Report

   ### 🎯 Query
   [Original user question]

   ### 📊 Sources Analyzed
   - Google Drive: [files found]
   - Obsidian: [relevant notes]
   - Previous context: [kiss*.md summary]

   ### 🔍 Key Findings
   [Bullet points of discoveries]

   ### 💡 Recommendations for Claude
   [Specific actionable recommendations]

   ### 🔄 Next Steps
   [Proposed next actions]
   ```

## Enhanced Skill Routing (AI 자동 매뉴얼 시스템)

When user's request matches available skill, invoke it via Skill tool. **Auto-routing based on keywords, context, and file locations.**

### 🔍 Keyword-Based Auto-Routing
**Development & Code:**
- Firebase, 저장, 데이터베이스, auth → examine code, if Firebase-related, auto-invoke relevant skills
- 에러, 버그, 안됨, 작동안함, 문제 → invoke /investigate  
- 빌드, 컴파일, TypeScript → check build status, invoke /qa if issues
- 테스트, QA, 확인, 동작 → invoke /qa or /qa-only

**Content & Design:**
- 디자인, UI, UX, 스타일, 폴리시 → invoke /design-review
- 프롬프트, 콘텐츠, 텍스트 → check if shop-related, apply appropriate workflow
- 이미지, 갤러리, 업로드 → examine current context for relevant skills

**Project Management:**
- 계획, 아키텍처, 구조, 설계 → invoke /plan-eng-review
- 전략, 방향, 스코프 → invoke /plan-ceo-review  
- 아이디어, 브레인스토밍, 제안 → invoke /office-hours

**Context-Aware Routing:**
- If working in `/shop/*` files → prioritize shop/Firebase-related workflows
- If working in `/api/*` files → prioritize backend/API workflows  
- If TypeScript errors present → auto-invoke /investigate
- If git status shows changes → consider /review before commits

### 🎯 Traditional Routing (Fallback)
- Commit requests ("커밋해줘", "commit this", "commit", "커밋") → enhanced auto-commit workflow:
  1. Automatic quality pre-check (/review in background)
  2. TypeScript compilation check (tsc --noEmit)
  3. Build test (bun build --dry-run if available)
  4. Caveman-compressed commit message generation
  5. Git commit with Co-Authored-By: Claude
  6. Post-commit verification report
- Commit requests ("커밋해줘", "commit this", "commit", "커밋") → enhanced auto-commit workflow:
  1. Automatic quality pre-check (/review in background)
  2. TypeScript compilation check (tsc --noEmit)
  3. Build test (bun build --dry-run if available)
  4. Caveman-compressed commit message generation
  5. Git commit with Co-Authored-By: Claude
  6. Post-commit verification report
- Save progress → invoke /context-save
- Resume context → invoke /context-restore