import {NextRequest, NextResponse} from "next/server"
import {adminDB} from "@/api/firebaseAdmin"

// 토큰 인증 쇼트링크 생성 API (PopClip 등 외부 클라이언트용).
// Firebase Admin SDK로 쓰기 → RTDB 보안규칙 우회(서버 신뢰 컨텍스트).

const TOKEN = process.env.SHORTLINK_TOKEN

const B62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
function genSlug(len = 6): string {
  let s = ""
  for (let i = 0; i < len; i++) s += B62[Math.floor(Math.random() * B62.length)]
  return s
}

export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({error: "SHORTLINK_TOKEN not set"}, {status: 500})
  }

  const db = adminDB()
  if (!db) {
    return NextResponse.json(
      {error: "admin sdk not configured (FIREBASE_SERVICE_ACCOUNT)"},
      {status: 500}
    )
  }

  // 토큰 검사
  const auth = req.headers.get("authorization") || ""
  const token = auth.replace(/^Bearer\s+/i, "")
  if (token !== TOKEN) {
    return NextResponse.json({error: "unauthorized"}, {status: 401})
  }

  let body: {url?: string; slug?: string}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({error: "invalid json"}, {status: 400})
  }

  const url = (body.url || "").trim()
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({error: "http(s) URL required"}, {status: 400})
  }

  const exists = async (slug: string) =>
    (await db.ref(`shortlinks/${slug}`).get()).exists()

  // 슬러그 결정
  let slug = (body.slug || "").trim()
  if (slug) {
    if (await exists(slug)) {
      return NextResponse.json({error: `slug "${slug}" taken`}, {status: 409})
    }
  } else {
    slug = genSlug()
    for (let i = 0; i < 5 && (await exists(slug)); i++) slug = genSlug()
  }

  const link = {slug, url, createdAt: Date.now(), clicks: 0}
  try {
    await db.ref(`shortlinks/${slug}`).set(link)
  } catch {
    return NextResponse.json({error: "db write failed"}, {status: 502})
  }

  // 어디서 생성하든(로컬 포함) 공개 도메인으로 반환 — 같은 Firebase라 프로덕션서 열림
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://rainskiss.com"
  return NextResponse.json({slug, url, short: `${base}/s/${slug}`})
}
