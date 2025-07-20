"use client"

import {useAuthContext} from "./context/AuthContext"
import {useRouter} from "next/navigation"
import {useEffect} from "react"

export default function ProtectedRoute({children, requireAdmin = false}) {
  const {user} = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user || (requireAdmin && !user.isAdmin)) {
      router.replace("/") // redirect to home if not logged in or not admin
    }
  }, [user, requireAdmin, router])

  if (!user || (requireAdmin && !user.isAdmin)) {
    return null // block rendering
  }

  return <>{children}</>
}
