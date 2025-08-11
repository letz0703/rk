// src/app/admin/products/[id]/download/route.ts
import db from "@/db/db"
import fs from "fs/promises"
import {NextRequest, NextResponse} from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic" // 빌더가 정적 추론하지 않도록

export async function GET(
  _req: NextRequest,
  {params}: {params: {id: string}} // <- 컨텍스트 타입 명확
) {
  const {id} = params

  const product = await db.product.findUnique({
    where: {id},
    select: {filePath: true, name: true}
  })

  if (!product) {
    return new NextResponse(null, {status: 404})
  }

  const {size} = await fs.stat(product.filePath)
  const file = await fs.readFile(product.filePath)
  const extension = product.filePath.split(".").pop() ?? ""

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString()
    }
  })
}
