import { NextRequest, NextResponse } from "next/server"

// 어드민 비번은 .env 의 ADMIN_PASSWORD 하나만 사용
// Firebase 불필요 — 서버에만 존재, 클라이언트 노출 없음
export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!password) return NextResponse.json({ error: "empty" }, { status: 400 })

  const correct = process.env.ADMIN_PASSWORD ?? null
  if (!correct) return NextResponse.json({ error: "not configured" }, { status: 500 })
  if (password !== correct) return NextResponse.json({ error: "wrong" }, { status: 401 })

  return NextResponse.json({ ok: true })
}
