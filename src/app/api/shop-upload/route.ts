import {NextRequest, NextResponse} from "next/server"
import {storage} from "@/api/firebase"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"

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

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    // Firebase Storage에 업로드
    const storageRef = ref(storage, `shop/${slug}/${filename}`)
    const snapshot = await uploadBytes(storageRef, buffer)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return NextResponse.json({url: downloadURL})
  } catch (e) {
    console.error("[shop-upload]", e)
    return NextResponse.json({error: "upload failed"}, {status: 500})
  }
}
