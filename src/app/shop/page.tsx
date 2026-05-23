export const dynamic = "force-dynamic"
import {Suspense} from "react"
import AuthGuard from "@/components/AuthGuard"
import ShopPageContent from "./ShopPageContent"

export default function ShopPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div>Loading shop...</div>}>
        <ShopPageContent />
      </Suspense>
    </AuthGuard>
  )
}
