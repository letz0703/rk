import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME!
const API_KEY = process.env.CLOUDINARY_API_KEY!
const API_SECRET = process.env.CLOUDINARY_API_SECRET!

const BASE = `https://api.cloudinary.com/v1_1/${CLOUD}`

// Basic Auth 헤더 (Admin API용)
function authHeader() {
  return "Basic " + Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")
}

// Cloudinary 서명 생성
function sign(params: Record<string, string>): string {
  const str = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
  return crypto.createHash("sha1").update(str + API_SECRET).digest("hex")
}

// public_id 추출 (https://res.cloudinary.com/.../upload/v123/models/minju/profile.jpg)
function toPublicId(url: string): string {
  return url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)?.[1] ?? ""
}

// ── GET: 이미지 목록 ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? ""
  const res = await fetch(
    `${BASE}/resources/image?type=upload&prefix=models/${slug}/&max_results=100`,
    { headers: { Authorization: authHeader() } }
  )
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ profileImage: null, gallery: [] })

  const resources: { public_id: string; secure_url: string }[] = data.resources ?? []
  const profileItem = resources.find(r => r.public_id.split("/").pop() === "profile")
  const gallery = resources
    .filter(r => r.public_id.split("/").pop() !== "profile")
    .map(r => r.secure_url)

  return NextResponse.json({
    profileImage: profileItem?.secure_url ?? null,
    gallery,
  })
}

// ── POST: 이미지 업로드 ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const slug = form.get("slug") as string
  const type = form.get("type") as "profile" | "gallery"
  const file = form.get("file") as File

  const timestamp = String(Math.round(Date.now() / 1000))
  const publicId =
    type === "profile"
      ? `models/${slug}/profile`
      : `models/${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const params: Record<string, string> = {
    public_id: publicId,
    timestamp,
    ...(type === "profile" ? { overwrite: "true" } : {}),
  }
  const signature = sign(params)

  const cloudForm = new FormData()
  cloudForm.append("file", file)
  cloudForm.append("api_key", API_KEY)
  cloudForm.append("signature", signature)
  Object.entries(params).forEach(([k, v]) => cloudForm.append(k, v))

  const res = await fetch(`${BASE}/image/upload`, { method: "POST", body: cloudForm })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.error?.message }, { status: 400 })

  return NextResponse.json({ url: data.secure_url })
}

// ── DELETE: 이미지 삭제 ───────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { url } = await req.json()
  const publicId = toPublicId(url)
  if (!publicId) return NextResponse.json({ error: "invalid url" }, { status: 400 })

  const res = await fetch(
    `${BASE}/resources/image/upload?public_ids[]=${encodeURIComponent(publicId)}`,
    { method: "DELETE", headers: { Authorization: authHeader() } }
  )
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.error?.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
