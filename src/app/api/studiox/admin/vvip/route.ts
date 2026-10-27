import {NextRequest, NextResponse} from "next/server"
import {hashPassword, randomPassword} from "@/lib/studiox/crypto"
import {db, isAdmin, latestPublishedNo, listVvipKeys} from "@/lib/studiox/store"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  const keys = (await listVvipKeys()).map(({passHash: _omit, ...rest}) => rest)
  return NextResponse.json({keys, latest: await latestPublishedNo()})
}

// 새 VVIP 비번 — 만든 시점의 최신 공개 회차까지 얼굴판 열람. 옛 비번은 그대로 살아 있다.
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  const body = (await req.json().catch(() => ({}))) as {password?: string; maxEpisode?: number}
  const password = body.password?.trim() || randomPassword()
  if (password.length < 6) return NextResponse.json({error: "too short"}, {status: 400})
  const maxEpisode = Number.isInteger(body.maxEpisode) ? Number(body.maxEpisode) : await latestPublishedNo()

  const ref = db().ref("studiox/vvipKeys").push()
  await ref.set({id: ref.key, passHash: hashPassword(password), maxEpisode, createdAt: Date.now()})
  return NextResponse.json({ok: true, password, maxEpisode})
}

// 폐기 — 그 비번으로 들어온 세션도 다음 요청부터 막힌다(getViewer가 매번 확인).
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  const {id} = (await req.json().catch(() => ({}))) as {id?: string}
  if (!id) return NextResponse.json({error: "invalid"}, {status: 400})
  await db().ref(`studiox/vvipKeys/${id}`).update({revoked: true})
  return NextResponse.json({ok: true})
}
