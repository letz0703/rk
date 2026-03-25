import { NextRequest, NextResponse } from "next/server"

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!password) return NextResponse.json({ error: "empty" }, { status: 400 })

  let correct: string | null = null

  // Firebase에서 읽기 시도
  try {
    const res = await fetch(`${DB_URL}/config/memberPassword.json`)
    if (res.ok) {
      const val = await res.json()
      if (typeof val === "string") correct = val
    }
  } catch {
    // Firebase 접근 실패 시 무시하고 env로 폴백
  }

  // Firebase 실패 시 .env 폴백
  if (!correct) correct = process.env.MEMBER_PASSWORD ?? null

  if (!correct) return NextResponse.json({ error: "not configured" }, { status: 500 })
  if (password !== correct) return NextResponse.json({ error: "wrong" }, { status: 401 })

  return NextResponse.json({ ok: true })
}
