"use client"

import {useAuthContext} from "@/components/context/AuthContext"
import {useRouter} from "next/navigation"
import {useEffect} from "react"

export default function ProtectedRoute({children, requireAdmin}) {
  const {user} = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user || (requireAdmin && !user.isAdmin)) {
      router.replace("/") // ❗️ "/" 경로로 강제 이동
    }
  }, [user, requireAdmin, router])

  if (!user || (requireAdmin && !user.isAdmin)) {
    return null // ❗️ 렌더링 막기 (잠깐이라도 보이지 않게)
  }

  return <>{children}</>
}
