"use client"

import {useRouter} from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()
  async function logout() {
    await fetch("/api/studiox/logout", {method: "POST"})
    router.push("/studiox")
    router.refresh()
  }
  return (
    <button onClick={logout} className="text-neutral-500 hover:text-white">
      나가기
    </button>
  )
}
