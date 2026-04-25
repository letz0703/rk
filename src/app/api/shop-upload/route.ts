import {NextRequest, NextResponse} from "next/server"
import {writeFile, mkdir} from "fs/promises"
import {join} from "path"

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
    const buffer = Buffer.from(bytes)
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const dir = join(process.cwd(), "public", "shop", slug)
    await mkdir(dir, {recursive: true})
    await writeFile(join(dir, filename), buffer)

    return NextResponse.json({url: `/shop/${slug}/${filename}`})
  } catch (e) {
    console.error("[shop-upload]", e)
    return NextResponse.json({error: "upload failed"}, {status: 500})
  }
}
