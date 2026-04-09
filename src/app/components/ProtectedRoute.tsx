"use client"

//import {useAuthContext} from "../../components/context/AuthContext"
import {useAuthContext} from "@/components/context/AuthContext"
import {useRouter} from "next/navigation"
import {useEffect} from "react"
import React from "react"

export default function ProtectedRoute({children, requireAdmin = false}: {children: React.ReactNode; requireAdmin?: boolean}) {
  const {user, isAdmin} = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user || (requireAdmin && !isAdmin)) {
      router.replace("/")
    }
  }, [user, isAdmin, requireAdmin, router])

  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
