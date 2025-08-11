// src/app/admin/products/[id]/download/route.ts
import db from "@/db/db"
import {notFound} from "next/navigation"
import fs from "fs/promises"

// 💡 fs 사용하므로 node 런타임 강제
export const runtime = "nodejs"

export async function GET(_req: Request, {params}: {params: {id: string}}) {
  const {id} = params

  const product = await db.product.findUnique({
    where: {id},
    select: {filePath: true, name: true}
  })

  if (!product) return notFound()

  const {size} = await fs.stat(product.filePath)
  const file = await fs.readFile(product.filePath)
  const extension = product.filePath.split(".").pop() ?? ""

  return new Response(file, {
    headers: {
      "Content-Type": "application/octet-stream",
      // ✅ 닫는 따옴표 추가
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString()
    }
  })
}
