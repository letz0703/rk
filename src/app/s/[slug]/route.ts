import {NextRequest, NextResponse} from "next/server"
import {adminDB} from "@/api/firebaseAdmin"

// 리다이렉트는 공개 읽기(REST)로, 클릭카운트는 Admin SDK 쓰기로.
const DB = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

// GET /s/{slug} → 원본 URL 조회 후 302 리다이렉트. 없으면 홈으로.
export async function GET(
  req: NextRequest,
  {params}: {params: Promise<{slug: string}>}
) {
  const {slug} = await params
  const origin = new URL(req.url).origin

  if (!DB) return NextResponse.redirect(origin, 302)

  try {
    const res = await fetch(`${DB}/shortlinks/${slug}.json`, {cache: "no-store"})
    const data = res.ok ? await res.json() : null

    if (!data || !data.url) {
      return NextResponse.redirect(origin, 302) // 없는 슬러그 → 홈
    }

    // 클릭 +1 (Admin SDK, 실패해도 리다이렉트는 진행)
    const db = adminDB()
    if (db) {
      const cur = typeof data.clicks === "number" ? data.clicks : 0
      db.ref(`shortlinks/${slug}/clicks`)
        .set(cur + 1)
        .catch(() => {})
    }

    return NextResponse.redirect(data.url, 302)
  } catch {
    return NextResponse.redirect(origin, 302)
  }
}
