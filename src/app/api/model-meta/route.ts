import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

const DATA_PATH = path.join(process.cwd(), "src/app/models/models-data.json")

type ModelRow = { slug: string; gallery?: GalleryItem[]; [key: string]: unknown }
type GalleryItem = { id: string; thumbnail: string; deviantartUrl: string; easelUrl: string; memo: string }

async function readData(): Promise<ModelRow[]> {
  return JSON.parse(await readFile(DATA_PATH, "utf-8"))
}
async function writeData(data: ModelRow[]) {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  const data = await readData()
  if (slug) return NextResponse.json(data.find(m => m.slug === slug) ?? null)
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { slug, action } = body as { slug: string; action: string; [k: string]: unknown }

  const data = await readData()
  const idx = data.findIndex(m => m.slug === slug)
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 })

  const model = data[idx]

  switch (action) {
    case "update-meta": {
      const { bio, deviantArtUrl } = body as { bio: string; deviantArtUrl: string }
      data[idx] = { ...model, bio, deviantArtUrl }
      break
    }

    case "add-gallery-item": {
      const { item } = body as { item: Omit<GalleryItem, "id"> }
      const newItem: GalleryItem = { ...item, id: crypto.randomUUID() }
      data[idx] = { ...model, gallery: [...(model.gallery ?? []), newItem] }
      break
    }

    case "update-gallery-item": {
      const { id, updates } = body as { id: string; updates: Partial<GalleryItem> }
      data[idx] = {
        ...model,
        gallery: (model.gallery ?? []).map(item =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }
      break
    }

    case "delete-gallery-item": {
      const { id } = body as { id: string }
      data[idx] = {
        ...model,
        gallery: (model.gallery ?? []).filter(item => item.id !== id),
      }
      break
    }

    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 })
  }

  await writeData(data)
  return NextResponse.json({ ok: true })
}
