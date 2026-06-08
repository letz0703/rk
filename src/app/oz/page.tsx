import {promptsData, type Prompt} from "@/data/prompts-data"
import OzSearch from "./OzSearch"

// obsidian/04_Products 파일 변경 즉시 반영
export const dynamic = "force-dynamic"

// 가벼운 frontmatter 파서 (제목/이미지/메타 추출, 본문은 그대로 보존)
function parseFrontmatter(raw: string): {meta: Record<string, string>; body: string} {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return {meta: {}, body: raw.trim()}

  const meta: Record<string, string> = {}
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const val = line.slice(idx + 1).trim()
    if (key) meta[key] = val
  }
  return {meta, body: m[2].trim()}
}

// obsidian/04_Products 의 md 프롬프트를 제목 + 본문 전체로 로드
function loadObsidianPrompts(): Prompt[] {
  if (typeof window !== "undefined") return []

  try {
    const fs = require("fs")
    const path = require("path")
    const dir = path.join(process.cwd(), "obsidian/04_Products")
    if (!fs.existsSync(dir)) return []

    const out: Prompt[] = []
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue
      const slug = path.basename(file, ".md")
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8")
        const {meta, body} = parseFrontmatter(raw)
        const created = meta.createdAt ? new Date(meta.createdAt).getTime() : NaN

        // 표시용 미리보기: 유료 섹션(## Prompts / ## Model Prompt) 중 먼저 오는 곳 이전까지만 노출
        // 순서 바뀌어도 유료 본문 안 새도록 둘 다 컷
        const preview = body.split(/^##\s+(?:Prompts|Model Prompt)\b/im)[0].trim() || body.slice(0, 300)

        // searchText는 미리보기 + 메타만 (유료 Soft/Hard 본문은 클라이언트로 안 보냄 = view-source 누수 차단)
        const tags = (meta.tags || "").replace(/[[\]]/g, "")

        out.push({
          id: `obsidian-${slug}`,
          title: meta.title || slug,
          content: preview, // 미리보기만 표시 (유료 프롬프트 숨김)
          searchText: `${preview} ${[meta.title, meta.category, meta.collection, meta.mood, tags, slug].filter(Boolean).join(" ")}`.toLowerCase(),
          images: meta.image ? [meta.image] : undefined,
          createdAt: Number.isFinite(created) ? created : undefined
        })
      } catch (err) {
        console.log(`oz: failed to parse ${slug}`, err)
      }
    }
    return out
  } catch (err) {
    console.log("oz: obsidian scan failed", err)
    return []
  }
}

export default function OzPage() {
  const obsidianPrompts = loadObsidianPrompts()

  // obsidian 제목과 겹치는 static 프롬프트는 제외 (obsidian 우선)
  const seenTitles = new Set(obsidianPrompts.map(p => p.title))
  const merged = [
    ...obsidianPrompts,
    ...promptsData.filter(p => !seenTitles.has(p.title))
  ]

  return <OzSearch prompts={merged} />
}
