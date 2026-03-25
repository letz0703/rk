"use client"

import { useAuthContext } from "@/components/context/AuthContext"

const ADMIN_EMAIL = "rainskiss@gmail.com"

export default function HeaderAuth() {
  const { user, isLoading, login, logout } = useAuthContext()

  if (isLoading) return null

  if (user) {
    const isAdmin = user.email === ADMIN_EMAIL
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <span className="text-[10px] font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">
            Admin
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {user.photoURL && (
          <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
        )}
        <button
          onClick={() => logout()}
          className="text-xs text-white/50 hover:text-white transition"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => login()}
      className="text-xs text-white/50 hover:text-white transition"
    >
      Google 로그인
    </button>
  )
}
