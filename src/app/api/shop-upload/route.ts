import {NextRequest, NextResponse} from "next/server"
import crypto from "crypto"

// Firebase Storage 버킷이 프로젝트에 없어서(storage/unknown 404) 업로드가 전부 실패했다.
// 이미 next.config·image.ts 에 허용된 Cloudinary 로 올린다. SDK 없이 서명 REST 업로드.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const slug = formData.get("slug") as string | null

    if (!file || !slug) {
      return NextResponse.json({error: "file and slug required"}, {status: 400})
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({error: "images only"}, {status: 400})
    }

    const cloud = process.env.CLOUDINARY_CLOUD_NAME
    const key = process.env.CLOUDINARY_API_KEY
    const secret = process.env.CLOUDINARY_API_SECRET
    if (!cloud || !key || !secret) {
      return NextResponse.json({error: "cloudinary not configured"}, {status: 500})
    }

    const folder = `shop/${slug}`
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signature = crypto
      .createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${secret}`)
      .digest("hex")

    const body = new FormData()
    body.append("file", file)
    body.append("folder", folder)
    body.append("timestamp", timestamp)
    body.append("api_key", key)
    body.append("signature", signature)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: "POST",
      body
    })
    const data = await res.json()
    if (!res.ok) {
      console.error("[shop-upload]", data)
      return NextResponse.json({error: data?.error?.message ?? "upload failed"}, {status: 500})
    }

    return NextResponse.json({url: data.secure_url})
  } catch (e) {
    console.error("[shop-upload]", e)
    return NextResponse.json({error: "upload failed"}, {status: 500})
  }
}
