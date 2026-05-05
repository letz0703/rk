import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

const DATA_PATH = path.join(process.cwd(), "src/app/series-data.json")

type SeriesItem = { id: string; imageUrl: string; deviantartUrl: string; modelSlug: string; memo: string }
type SeriesRow = { slug: string; gallery?: SeriesItem[]; [key: string]: unknown }

async function readData(): Promise<SeriesRow[]> {
  return JSON.parse(await readFile(DATA_PATH, "utf-8"))
}
async function writeData(data: SeriesRow[]) {
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2))
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  const data = await readData()
  if (slug) return NextResponse.json(data.find(s => s.slug === slug) ?? null)
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { slug, action } = body as { slug: string; action: string; [k: string]: unknown }

  const data = await readData()
  const idx = data.findIndex(s => s.slug === slug)
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 })

  const series = data[idx]

  switch (action) {
    case "add-item": {
      const { item } = body as { item: Omit<SeriesItem, "id"> }
      const newItem: SeriesItem = { ...item, id: crypto.randomUUID() }
      data[idx] = { ...series, gallery: [...(series.gallery ?? []), newItem] }
      break
    }
    case "delete-item": {
      const { id } = body as { id: string }
      data[idx] = { ...series, gallery: (series.gallery ?? []).filter(i => i.id !== id) }
      break
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 })
  }

  await writeData(data)
  return NextResponse.json({ ok: true })
}
