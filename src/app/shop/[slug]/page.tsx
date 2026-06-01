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

  return (
    <AuthGuard>
      <ProductClient product={product} />
    </AuthGuard>
  )
}
