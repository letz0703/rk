// 쇼트링크 저장소 — /shortlinks/{slug} = { url, createdAt, clicks }
// 클라이언트(관리자 폼)용 CRUD. 서버 라우트(리다이렉트/토큰 API)는 REST 사용(별도).
import {database} from "@/api/firebase"
import {ref, set, get, remove, query, orderByChild} from "firebase/database"

const ROOT = "shortlinks"

export type Shortlink = {
  slug: string
  url: string
  createdAt: number
  clicks: number
}

// base62 슬러그 6자 생성
const B62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
export function genSlug(len = 6): string {
  let s = ""
  for (let i = 0; i < len; i++) s += B62[Math.floor(Math.random() * B62.length)]
  return s
}

// 슬러그 중복 확인
export async function slugExists(slug: string): Promise<boolean> {
  const snap = await get(ref(database, `${ROOT}/${slug}`))
  return snap.exists()
}

// 생성 (충돌 시 재시도). customSlug 있으면 그대로(이미 있으면 에러).
export async function createShortlink(
  url: string,
  customSlug?: string
): Promise<Shortlink> {
  if (!/^https?:\/\//i.test(url)) throw new Error("http(s) URL만 가능")

  let slug = customSlug?.trim() || genSlug()
  if (customSlug) {
    if (await slugExists(slug)) throw new Error(`슬러그 "${slug}" 이미 사용중`)
  } else {
    // 랜덤 충돌 회피 (최대 5회)
    for (let i = 0; i < 5 && (await slugExists(slug)); i++) slug = genSlug()
  }

  const link: Shortlink = {slug, url, createdAt: Date.now(), clicks: 0}
  await set(ref(database, `${ROOT}/${slug}`), link)
  return link
}

// 전체 목록 (최신순)
export async function listShortlinks(): Promise<Shortlink[]> {
  const snap = await get(query(ref(database, ROOT), orderByChild("createdAt")))
  if (!snap.exists()) return []
  const out: Shortlink[] = []
  snap.forEach(child => {
    out.push(child.val() as Shortlink)
  })
  return out.reverse() // 최신 먼저
}

// 삭제
export async function deleteShortlink(slug: string): Promise<void> {
  await remove(ref(database, `${ROOT}/${slug}`))
}
