import {NextRequest, NextResponse} from "next/server"
import {writeFile, readFile} from "fs/promises"
import {join} from "path"
import {invalidateObsidianCache} from "@/data/shop-products"

/**
 * /oz 작업실에서 draft 상품 본문(프롬프트 전체) 직접 편집 → md 파일 body 되쓰기.
 * frontmatter는 보존하고 body만 교체한다.
 *
 * ⚠️ 로컬 dev 전용 (프로덕션 파일시스템 read-only).
 * ⚠️ 임시 무인증 — /api/shop/publish와 동일 posture. 런칭 전 admin 게이트 필요.
 */
export async function POST(req: NextRequest) {
  try {
    const {slug, body} = (await req.json()) as {slug?: string; body?: string}

    if (!slug || typeof body !== "string") {
      return NextResponse.json({error: "slug and body required"}, {status: 400})
    }
    // slug 화이트리스트 (경로 탈출 방지)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({error: "invalid slug"}, {status: 400})
    }

    const mdPath = join(process.cwd(), "obsidian/04_Products", `${slug}.md`)
    let md: string
    try {
      md = await readFile(mdPath, "utf-8")
    } catch {
      return NextResponse.json({error: "product not found"}, {status: 404})
    }

    // frontmatter 보존, body만 교체
    const m = md.match(/^(---\r?\n[\s\S]*?\r?\n---)\r?\n?[\s\S]*$/)
    if (!m) {
      return NextResponse.json({error: "frontmatter not found"}, {status: 422})
    }
    const updated = `${m[1]}\n\n${body.trim()}\n`
    await writeFile(mdPath, updated, "utf-8")

    // stale 캐시 제거 → /oz·/shop 즉시 반영
    invalidateObsidianCache(slug)

    return NextResponse.json({ok: true, slug})
  } catch (e) {
    console.error("[shop/save-md]", e)
    return NextResponse.json({error: "save failed"}, {status: 500})
  }
}
