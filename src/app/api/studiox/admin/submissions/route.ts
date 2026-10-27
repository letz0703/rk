import {NextRequest, NextResponse} from "next/server"
import {hashPassword, randomPassword} from "@/lib/studiox/crypto"
import {db, isAdmin, listSubmissions, type Submission} from "@/lib/studiox/store"

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  return NextResponse.json({submissions: await listSubmissions()})
}

// accept = 회원 생성 + 개인 비번 발급(응답에서 한 번만 보여 줌, DB엔 해시만)
// reset  = 이미 채택된 회원의 비번 재발급 / reject = 거절 표시
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({error: "unauthorized"}, {status: 401})
  const {id, action} = (await req.json().catch(() => ({}))) as {id?: string; action?: string}
  if (!id) return NextResponse.json({error: "invalid"}, {status: 400})

  const subRef = db().ref(`studiox/submissions/${id}`)
  const sub = (await subRef.get()).val() as Submission | null
  if (!sub) return NextResponse.json({error: "not found"}, {status: 404})

  if (action === "reject") {
    await subRef.update({status: "rejected"})
    return NextResponse.json({ok: true})
  }

  if (action === "accept" || action === "reset") {
    const password = randomPassword()
    const memberRef = sub.memberId ? db().ref(`studiox/members/${sub.memberId}`) : db().ref("studiox/members").push()
    if (sub.memberId) {
      await memberRef.update({passHash: hashPassword(password)})
    } else {
      await memberRef.set({
        id: memberRef.key,
        email: sub.email,
        passHash: hashPassword(password),
        createdAt: Date.now(),
        submissionId: id
      })
      await subRef.update({status: "accepted", memberId: memberRef.key})
    }
    return NextResponse.json({ok: true, email: sub.email, password})
  }

  return NextResponse.json({error: "invalid action"}, {status: 400})
}
