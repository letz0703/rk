// STUDIO-X /studiox 전용 — 비밀번호 해시 + 세션 토큰 서명. 서버 전용(node:crypto).
import {createHash, createHmac, randomBytes, scryptSync, timingSafeEqual} from "crypto"

// 비밀번호는 원문 저장 금지 — scrypt 해시 `salt:hash` 형태로만 둔다.
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 32).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const test = scryptSync(password, salt, 32)
  const known = Buffer.from(hash, "hex")
  return known.length === test.length && timingSafeEqual(known, test)
}

// 헷갈리는 글자(0/O, 1/l/I) 뺀 읽기 쉬운 비번 — 이메일·DA 게시물에 그대로 붙여 넣는 용도.
const READABLE = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
export function randomPassword(length = 10): string {
  const bytes = randomBytes(length)
  let out = ""
  for (let i = 0; i < length; i++) out += READABLE[bytes[i] % READABLE.length]
  return out
}

// X_SESSION_SECRET 이 없으면 ADMIN_PASSWORD 에서 파생 — 둘 다 없으면 세션 자체를 막는다.
function secret(): string | null {
  const s = process.env.X_SESSION_SECRET
  if (s) return s
  const admin = process.env.ADMIN_PASSWORD
  return admin ? createHash("sha256").update(`x-session:${admin}`).digest("hex") : null
}

export type XSessionPayload =
  | {role: "member"; id: string; exp: number}
  | {role: "vvip"; id: string; exp: number}
  | {role: "admin"; exp: number}

// `base64url(json).base64url(hmac)` — 쿠키 값.
export function signToken(payload: XSessionPayload): string | null {
  const key = secret()
  if (!key) return null
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const sig = createHmac("sha256", key).update(body).digest("base64url")
  return `${body}.${sig}`
}

export function verifyToken(token: string | undefined): XSessionPayload | null {
  const key = secret()
  if (!key || !token) return null
  const [body, sig] = token.split(".")
  if (!body || !sig) return null
  const expected = createHmac("sha256", key).update(body).digest("base64url")
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as XSessionPayload
    return payload.exp > Date.now() ? payload : null
  } catch {
    return null
  }
}
