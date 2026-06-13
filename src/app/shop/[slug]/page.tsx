import {notFound} from "next/navigation"
import AuthGuard from "@/components/AuthGuard"
import ProductClient from "./ProductClient"
import {getProduct} from "@/data/shop-products"

export default async function ProductPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  // draft(작업중)는 /shop 공개 매대에서 숨김 — /oz 작업실에서만 노출
  if (product.status === "draft") notFound()

  return (
    <AuthGuard>
      <ProductClient product={product} />
    </AuthGuard>
  )
}
