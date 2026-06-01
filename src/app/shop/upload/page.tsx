export const dynamic = "force-dynamic"
import {Suspense} from "react"
import AuthGuard from "@/components/AuthGuard"
import UploadPageContent from "./UploadPageContent"

export default function UploadPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div>Loading upload...</div>}>
        <UploadPageContent />
      </Suspense>
    </AuthGuard>
  )
}