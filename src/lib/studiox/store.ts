// STUDIO-X /studiox 데이터 — RTDB `studiox/` 아래, Admin SDK로만 읽고 쓴다(클라이언트 규칙 불필요).
//   studiox/submissions/{id}  고민 투고
//   studiox/members/{id}      채택 회원(개인 비번)
//   studiox/vvipKeys/{id}     VVIP 공용 비번 — 만든 날 최신 회차까지만 얼굴판 열람
//   studiox/episodes/{no}     해결된 이야기
import {adminDB} from "@/api/firebaseAdmin"
import {cookies} from "next/headers"
import {verifyToken} from "./crypto"

export type Submission = {
  id: string
  email: string
  text: string
  createdAt: number
  status: "new" | "accepted" | "rejected"
  memberId?: string
}

export type Member = {id: string; email: string; passHash: string; createdAt: number; submissionId: string}

export type VvipKey = {id: string; passHash: string; maxEpisode: number; createdAt: number; revoked?: boolean}

export type Episode = {
  no: number
  title: string
  body: string
  image?: string // 얼굴 없는 삽화 — 회원 전원
  faceImage?: string // 얼굴 나온 삽화 — VVIP(비번의 maxEpisode 이하)만
  published: boolean
  createdAt: number
}

export const SESSION_COOKIE = "x_sess"
export const ADMIN_COOKIE = "x_admin"

export function db() {
  const d = adminDB()
  if (!d) throw new Error("Firebase Admin 미설정 (서비스계정/DATABASE_URL 확인)")
  return d
}

function list<T>(val: Record<string, T> | null): T[] {
  return val ? Object.values(val) : []
}

export async function listSubmissions(): Promise<Submission[]> {
  const snap = await db().ref("studiox/submissions").get()
  return list<Submission>(snap.val()).sort((a, b) => b.createdAt - a.createdAt)
}

export async function listVvipKeys(): Promise<VvipKey[]> {
  const snap = await db().ref("studiox/vvipKeys").get()
  return list<VvipKey>(snap.val()).sort((a, b) => b.createdAt - a.createdAt)
}

export async function listEpisodes(onlyPublished: boolean): Promise<Episode[]> {
  const snap = await db().ref("studiox/episodes").get()
  const all = list<Episode>(snap.val()).sort((a, b) => a.no - b.no)
  return onlyPublished ? all.filter(e => e.published) : all
}

export async function getEpisode(no: number): Promise<Episode | null> {
  const snap = await db().ref(`studiox/episodes/${no}`).get()
  return snap.val()
}

export async function latestPublishedNo(): Promise<number> {
  const eps = await listEpisodes(true)
  return eps.length ? eps[eps.length - 1].no : 0
}

// 현재 열람자 — 회원 삭제·VVIP 비번 폐기를 요청마다 DB로 다시 확인한다.
export type Viewer = {role: "member"} | {role: "vvip"; maxEpisode: number}

export async function getViewer(): Promise<Viewer | null> {
  const store = await cookies()
  const payload = verifyToken(store.get(SESSION_COOKIE)?.value)
  if (!payload) return null
  if (payload.role === "member") {
    const snap = await db().ref(`studiox/members/${payload.id}`).get()
    return snap.exists() ? {role: "member"} : null
  }
  if (payload.role === "vvip") {
    const snap = await db().ref(`studiox/vvipKeys/${payload.id}`).get()
    const key = snap.val() as VvipKey | null
    return key && !key.revoked ? {role: "vvip", maxEpisode: key.maxEpisode} : null
  }
  return null
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifyToken(store.get(ADMIN_COOKIE)?.value)?.role === "admin"
}
