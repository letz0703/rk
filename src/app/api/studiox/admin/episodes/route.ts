import {NextRequest, NextResponse} from "next/server"
import {z} from "zod"
import {db, isAdmin, listEpisodes} from "@/lib/studiox/store"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  return NextResponse.json({episodes: await listEpisodes(false)})
}

const schema = z.object({
  no: z.number().int().positive(),
  title: z.string().trim().min(1).max(200),
  body: z.string().max(50000),
  image: z.string().trim().url().optional().or(z.literal("")),
  faceImage: z.string().trim().url().optional().or(z.literal("")),
  published: z.boolean()
})

// 회차 번호가 키 — 같은 번호로 다시 저장하면 덮어쓴다.
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({error: "invalid", issues: parsed.error.issues}, {status: 400})
  const ep = parsed.data
  const ref = db().ref(`studiox/episodes/${ep.no}`)
  const prev = (await ref.get()).val() as {createdAt?: number} | null
  await ref.set({
    ...ep,
    image: ep.image || null,
    faceImage: ep.faceImage || null,
    createdAt: prev?.createdAt ?? Date.now()
  })
  return NextResponse.json({ok: true})
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  const {no} = (await req.json().catch(() => ({}))) as {no?: number}
  if (!Number.isInteger(no)) return NextResponse.json({error: "invalid"}, {status: 400})
  await db().ref(`studiox/episodes/${no}`).remove()
  return NextResponse.json({ok: true})
}
