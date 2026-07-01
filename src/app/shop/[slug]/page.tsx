import AuthGuard from "@/components/AuthGuard"
import ProductFirebaseClient from "./ProductFirebaseClient"

export default async function ProductPage({
  params
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  return (
    <AuthGuard>
      <ProductFirebaseClient slug={slug} />
    </AuthGuard>
  )
}
