import {NextRequest, NextResponse} from "next/server"
import crypto from "crypto"
import {adminAuth, adminDB, serverSecret} from "@/api/firebaseAdmin"
import {ADMIN_EMAILS} from "@/lib/adminEmails"

// 상품 구매 코드 → 허용 이메일 자동 등록.
// DA 유료 부분에 상품별 코드를 적어 두면, 구매자가 Google 로그인 후 상품 페이지에서 코드를 넣고
// 그 이메일이 shop-products/{slug}/viewers 에 들어간다(그 상품 HARD 만 열림).
//
// 코드는 DB 에 저장하지 않는다 — RTDB 가 전체 공개 읽기라서. HMAC(서버 비밀, slug:버전)으로 계산하고
// 버전(codeVersion, 공개돼도 무방)만 상품에 둔다. "새 코드" = 버전 +1, 이미 등록된 이메일은 그대로.
//
// POST {slug, code}  구매자 — 코드 확인 후 본인 이메일 등록
// GET  ?slug=        관리자 — 현재 코드 조회
// PUT  {slug}        관리자 — 코드 새로 만들기

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ" // 헷갈리는 0/O/1/I/L 제외
const SLUG_RE = /^[a-z0-9-]{1,100}$/

function makeCode(secret: string, slug: string, version: number): string {
  const h = crypto.createHmac("sha256", secret).update(`shop-code:${slug}:${version}`).digest()
  let s = ""
  for (let i = 0; i < 8; i++) s += ALPHABET[h[i] % ALPHABET.length]
  return `${s.slice(0, 4)}-${s.slice(4)}`
}

const normalizeCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, "")

async function verifiedEmail(req: NextRequest): Promise<string | null> {
  const auth = adminAuth()
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "")
  if (!auth || !token) return null
  try {
    const decoded = await auth.verifyIdToken(token)
    if (!decoded.email || !decoded.email_verified) return null
    return decoded.email.toLowerCase()
  } catch {
    return null
  }
}

function setup() {
  const db = adminDB()
  const secret = serverSecret()
  return db && secret ? {db, secret} : null
}

async function readVersion(db: NonNullable<ReturnType<typeof adminDB>>, slug: string) {
  const snap = await db.ref(`shop-products/${slug}`).get()
  if (!snap.exists()) return null
  const v = Number(snap.child("codeVersion").val())
  return Number.isFinite(v) && v > 0 ? v : 1
}

export async function POST(req: NextRequest) {
  const s = setup()
  if (!s) return NextResponse.json({error: "server not configured"}, {status: 500})

  const email = await verifiedEmail(req)
  if (!email) return NextResponse.json({error: "Google 로그인이 필요합니다."}, {status: 401})

  const {slug, code} = (await req.json().catch(() => ({}))) as {slug?: string; code?: string}
  if (!slug || !SLUG_RE.test(slug) || !code) {
    return NextResponse.json({error: "slug and code required"}, {status: 400})
  }

  const version = await readVersion(s.db, slug)
  if (version === null) return NextResponse.json({error: "상품이 없습니다."}, {status: 404})

  const expected = Buffer.from(normalizeCode(makeCode(s.secret, slug, version)))
  const given = Buffer.from(normalizeCode(code))
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    return NextResponse.json({error: "코드가 맞지 않습니다."}, {status: 403})
  }

  let viewers: string[] = []
  await s.db.ref(`shop-products/${slug}/viewers`).transaction((cur: unknown) => {
    const list = Array.isArray(cur) ? (cur as string[]) : []
    viewers = list.includes(email) ? list : [...list, email]
    return viewers
  })
  return NextResponse.json({ok: true, email, viewers})
}

async function requireAdmin(req: NextRequest) {
  const email = await verifiedEmail(req)
  return email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email) ? email : null
}

export async function GET(req: NextRequest) {
  const s = setup()
  if (!s) return NextResponse.json({error: "server not configured"}, {status: 500})
  if (!(await requireAdmin(req))) return NextResponse.json({error: "admin only"}, {status: 403})

  const slug = req.nextUrl.searchParams.get("slug") || ""
  if (!SLUG_RE.test(slug)) return NextResponse.json({error: "bad slug"}, {status: 400})
  const version = await readVersion(s.db, slug)
  if (version === null) return NextResponse.json({error: "상품이 없습니다."}, {status: 404})

  return NextResponse.json({code: makeCode(s.secret, slug, version), version})
}

export async function PUT(req: NextRequest) {
  const s = setup()
  if (!s) return NextResponse.json({error: "server not configured"}, {status: 500})
  if (!(await requireAdmin(req))) return NextResponse.json({error: "admin only"}, {status: 403})

  const {slug} = (await req.json().catch(() => ({}))) as {slug?: string}
  if (!slug || !SLUG_RE.test(slug)) return NextResponse.json({error: "bad slug"}, {status: 400})
  const version = await readVersion(s.db, slug)
  if (version === null) return NextResponse.json({error: "상품이 없습니다."}, {status: 404})

  const next = version + 1
  await s.db.ref(`shop-products/${slug}/codeVersion`).set(next)
  return NextResponse.json({code: makeCode(s.secret, slug, next), version: next})
}
