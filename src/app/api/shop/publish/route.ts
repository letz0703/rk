import {NextRequest, NextResponse} from "next/server"
import {writeFile, readFile, readdir} from "fs/promises"
import {join} from "path"
import {invalidateObsidianCache} from "@/data/shop-products"

/**
 * draft 상품 publish: 생성 이미지 업로드 → public/shop/{slug}-01.jpg 저장 +
 * obsidian/04_Products/{slug}.md 를 status: active + image 로 수정 → 공개.
 *
 * ⚠️ 로컬 dev 전용 (프로덕션 파일시스템 read-only).
 * ⚠️ 임시 무인증 — URL 아는 사람 누구나. 런칭 전 admin 게이트 필요.
 *    (켜는 법: 아래 isAdmin 체크 주석 해제 + 클라에서 토큰/세션 전달)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const slug = formData.get("slug") as string | null
    // mode: publish(draft→active, -01) | replace(-01 덮어쓰기) | add(다음 -NN 추가)
    const mode = (formData.get("mode") as string | null) || "publish"

    if (!file || !slug) {
      return NextResponse.json({error: "file and slug required"}, {status: 400})
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({error: "images only"}, {status: 400})
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

    const shopDir = join(process.cwd(), "public", "shop")
    const buffer = Buffer.from(await file.arrayBuffer())

    // 다음 이미지 번호 결정
    let num = 1
    if (mode === "add") {
      const re = new RegExp(`^${slug}-(\\d+)\\.(jpg|jpeg|png|webp)$`, "i")
      let max = 0
      try {
        for (const f of await readdir(shopDir)) {
          const m = f.match(re)
          if (m) max = Math.max(max, parseInt(m[1], 10))
        }
      } catch {}
      num = max + 1
    }
    const fileName = `${slug}-${String(num).padStart(2, "0")}.jpg`
    const imagePath = `/shop/${fileName}`
    await writeFile(join(shopDir, fileName), buffer)

    // add 모드는 frontmatter 건드리지 않음(갤러리는 파일 스캔). publish/replace만 image+status 갱신.
    if (mode !== "add") {
      let updated = md
      updated = /^image:.*$/m.test(updated)
        ? updated.replace(/^image:.*$/m, `image: /shop/${slug}-01.jpg`)
        : updated.replace(/^---\n/, `---\nimage: /shop/${slug}-01.jpg\n`)
      updated = /^status:.*$/m.test(updated)
        ? updated.replace(/^status:.*$/m, "status: active")
        : updated.replace(/^---\n/, "---\nstatus: active\n")
      await writeFile(mdPath, updated, "utf-8")
    }

    // stale 캐시 제거 → /shop·/oz 즉시 반영
    invalidateObsidianCache(slug)

    return NextResponse.json({ok: true, slug, image: imagePath, mode, status: "active"})
  } catch (e) {
    console.error("[shop/publish]", e)
    return NextResponse.json({error: "publish failed"}, {status: 500})
  }
}
