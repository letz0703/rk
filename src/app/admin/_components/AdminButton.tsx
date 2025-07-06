"use client"

import { useEffect, useState } from "react"
import { getUserRole } from "@/app/admin/CheckAdmin" // 경로는 네 구조에 맞게

export default function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      const uid = stored ? JSON.parse(stored).uid : null
      setIsAdmin(getUserRole(uid) === "rkadmin")
    } catch {
      setIsAdmin(false)
    }
  }, [])

  if (!isAdmin) return null

  return (
    <button className="text-white bg-red-500 px-3 py-1 rounded">
      관리자 메뉴
    </button>
  )
}
