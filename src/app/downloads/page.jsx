"use client"

import BGMPage from "../components/BGMPage.tsx"
import ProtectedRoute from "../components/ProtectedRoute"

export default function DownloadsPage() {
  return (
    <ProtectedRoute requireAdmin={false}>
      <BGMPage />
    </ProtectedRoute>
  )
}
