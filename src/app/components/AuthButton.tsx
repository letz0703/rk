// app/components/AuthButtons.tsx  (경로는 프로젝트에 맞게 조정)
"use client"

import {login, logout} from "@/api/firebase"
import {useAuthContext} from "@/components/context/AuthContext"

export default function AuthButtons() {
  const {user} = useAuthContext()

  if (user) {
    return (
      <div className="flex items-center gap-3 p-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || "user"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm text-white/80">
          {user.displayName || user.email}
        </span>
        <button
          type="button"
          onClick={logout}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <div className="p-3">
      <button
        type="button"
        onClick={login}
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        구글 로그인
      </button>
    </div>
  )
}
