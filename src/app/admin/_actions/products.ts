"use server"

import db from "@/db/db"
import {z} from "zod"
import fs from "fs/promises"
import {notFound, redirect} from "next/navigation"

const fileSchema = z.instanceof(File, {message: "Required"})
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/"),
  {message: "Must be an image"}
)

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine(file => file.size > 0, {message: "Required"}),
  image: imageSchema.refine(file => file.size > 0, {message: "Required"})
})

export async function addProduct(prevState: unknown, formData: FormData) {
  const file = formData.get("file")
  const image = formData.get("image")

  if (!(file instanceof File) || !(image instanceof File)) {
    return {
      file: file instanceof File ? undefined : ["Invalid file"],
      image: image instanceof File ? undefined : ["Invalid image"]
    }
  }

  const result = addSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    priceInCents: formData.get("priceInCents"),
    file,
    image
  })

  if (!result.success) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  // 파일 저장
  await fs.mkdir("products", {recursive: true})
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  // 이미지 저장
  await fs.mkdir("public/products", {recursive: true})
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  )

  // DB 저장
  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath
    }
  })

  redirect("/admin/products")
}

export async function toggleProductAvailablibility(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({where: {id}, data: {isAvailableForPurchase}})
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({where: {id}})
  if (product == null) return notFound()
  await fs.unlink(product.filePath)
  await fs.unlink(`public${product.imagePath}`)
}
