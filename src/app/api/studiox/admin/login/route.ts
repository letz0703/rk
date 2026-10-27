import {NextRequest, NextResponse} from "next/server"
import {signToken} from "@/lib/studiox/crypto"
import {ADMIN_COOKIE} from "@/lib/studiox/store"

const HOURS_12 = 12 * 60 * 60 * 1000

// 관리자 비번은 기존 .env ADMIN_PASSWORD 그대로(check-admin-password와 같은 출처).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const correct = process.env.ADMIN_PASSWORD
  if (!correct) return NextResponse.json({error: "not configured"}, {status: 500})
  if (body?.password !== correct) return NextResponse.json({error: "wrong"}, {status: 401})

  const token = signToken({role: "admin", exp: Date.now() + HOURS_12})
  if (!token) return NextResponse.json({error: "not configured"}, {status: 500})
  const res = NextResponse.json({ok: true})
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: HOURS_12 / 1000
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ok: true})
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
