import { NextRequest, NextResponse } from "next/server"
import { adminDB } from "@/api/firebaseAdmin"

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!password) return NextResponse.json({ error: "empty" }, { status: 400 })

  let correct: string | null = null

  // Firebase에서 읽기 시도 — config 는 규칙상 관리자 전용 읽기라 Admin SDK 로 읽는다
  // (database.rules.json). 예전엔 공개 REST 로 읽어서 비밀번호가 누구에게나 보였다.
  try {
    const val = (await adminDB()?.ref("config/memberPassword").get())?.val()
    if (typeof val === "string") correct = val
  } catch {
    // Firebase 접근 실패 시 무시하고 env로 폴백
  }

  // Firebase 실패 시 .env 폴백
  if (!correct) correct = process.env.MEMBER_PASSWORD ?? null

  if (!correct) return NextResponse.json({ error: "not configured" }, { status: 500 })
  if (password !== correct) return NextResponse.json({ error: "wrong" }, { status: 401 })

  return NextResponse.json({ ok: true })
}
