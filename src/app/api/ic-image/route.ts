import {NextRequest, NextResponse} from "next/server"
import crypto from "crypto"

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME!
const API_KEY = process.env.CLOUDINARY_API_KEY!
const API_SECRET = process.env.CLOUDINARY_API_SECRET!

const BASE = `https://api.cloudinary.com/v1_1/${CLOUD}`

// Cloudinary 서명 생성
function sign(params: Record<string, string>): string {
  const str = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
  return crypto.createHash("sha1").update(str + API_SECRET).digest("hex")
}

// POST: /ic 브랜드 이미지 업로드 → Cloudinary secure_url 반환
export async function POST(req: NextRequest) {
  const form = await req.formData()
  // key = 고유 식별자 (브랜드: "glenfiddich", 제품: "glenfiddich-0")
  const key = (form.get("key") as string) || (form.get("brandId") as string) || "misc"
  const file = form.get("file") as File | null
  if (!file) return NextResponse.json({error: "file required"}, {status: 400})

  const timestamp = String(Math.round(Date.now() / 1000))
  // key당 1장 덮어쓰기
  const publicId = `ic/${key}`
  const params: Record<string, string> = {
    public_id: publicId,
    timestamp,
    overwrite: "true"
  }
  const signature = sign(params)

  const cloudForm = new FormData()
  cloudForm.append("file", file)
  cloudForm.append("api_key", API_KEY)
  cloudForm.append("signature", signature)
  Object.entries(params).forEach(([k, v]) => cloudForm.append(k, v))

  const res = await fetch(`${BASE}/image/upload`, {method: "POST", body: cloudForm})
  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json(
      {error: data.error?.message || "upload failed"},
      {status: 400}
    )
  }
  return NextResponse.json({url: data.secure_url as string})
}
