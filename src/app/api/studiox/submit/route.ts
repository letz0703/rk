import {NextRequest, NextResponse} from "next/server"
import {z} from "zod"
import {db} from "@/lib/studiox/store"

// 입구 투고 — 동의 3개 전부 체크해야 받는다. website 칸은 봇용 함정(사람에겐 안 보임).
const schema = z.object({
  email: z.string().trim().email().max(200),
  text: z.string().trim().min(10).max(5000),
  adult: z.literal(true),
  privacy: z.literal(true),
  adapt: z.literal(true),
  website: z.string().optional()
})

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({error: "invalid"}, {status: 400})
  const {email, text, website} = parsed.data
  if (website) return NextResponse.json({ok: true}) // 봇은 성공한 척만

  const ref = db().ref("studiox/submissions").push()
  await ref.set({id: ref.key, email: email.toLowerCase(), text, createdAt: Date.now(), status: "new"})
  return NextResponse.json({ok: true})
}
