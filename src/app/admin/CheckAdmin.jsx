"use client"

import {useAuthContext} from "@/components/context/AuthContext"

export default function CheckAdminButton() {
  const {user} = useAuthContext()
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID

  if (!user || String(user.uid) !== String(adminUid)) return null

  return (
    <button className="btn bg-yellow-700 px-2 ml-2">관리자 전용 버튼</button>
  )
}
