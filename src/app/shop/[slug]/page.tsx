import {notFound} from "next/navigation"
import AgeGate from "@/components/AgeGate"
import ProductClient from "./ProductClient"
import {getProduct} from "@/data/shop-products"

export default async function ProductPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const product = getProduct(slug)
  if (!product) notFound()

  return (
    <AgeGate>
      <ProductClient product={product} />
    </AgeGate>
  )
}
