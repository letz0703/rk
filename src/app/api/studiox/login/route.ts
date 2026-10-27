import {NextRequest, NextResponse} from "next/server"
import {signToken, verifyPassword} from "@/lib/studiox/crypto"
import {db, listVvipKeys, SESSION_COOKIE, type Member} from "@/lib/studiox/store"

const DAYS_30 = 30 * 24 * 60 * 60 * 1000

// 회원 = 이메일 + 개인 비번 / VVIP = 공용 비번만(DA 구독자 게시물).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const password = typeof body?.password === "string" ? body.password.trim() : ""
  if (!password) return NextResponse.json({error: "empty"}, {status: 400})

  let token: string | null = null
  if (body?.mode === "member") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    // orderByChild는 RTDB 규칙에 .indexOn이 있어야 해서, 규칙을 건드리지 않고 전체를 읽어 거른다(회원 수 적음).
    const snap = await db().ref("studiox/members").get()
    const members = Object.values((snap.val() ?? {}) as Record<string, Member>)
    const hit = members.find(m => m.email === email && verifyPassword(password, m.passHash))
    if (hit) token = signToken({role: "member", id: hit.id, exp: Date.now() + DAYS_30})
  } else {
    const hit = (await listVvipKeys()).find(k => !k.revoked && verifyPassword(password, k.passHash))
    if (hit) token = signToken({role: "vvip", id: hit.id, exp: Date.now() + DAYS_30})
  }
  if (!token) return NextResponse.json({error: "wrong"}, {status: 401})

  const res = NextResponse.json({ok: true})
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAYS_30 / 1000
  })
  return res
}
