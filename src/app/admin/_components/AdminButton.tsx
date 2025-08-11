"use client"
import {useAuthContext} from "@/components/context/AuthContext"

export default function AdminButton() {
  const {isAdmin} = useAuthContext()
  if (!isAdmin) return null
  return (
    <button className="btn bg-yellow-700 px-2 ml-2">관리자 전용 버튼</button>
  )
}
