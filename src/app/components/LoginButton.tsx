"use client"

import { useAuthContext } from "@/components/context/AuthContext"

export default function LoginButton() {
  const { user, login, logout } = useAuthContext()

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || "user"}
            className="w-7 h-7 rounded-full"
          />
        )}
        <button
          onClick={logout}
          className="text-red-400 text-sm hover:text-red-300 transition"
        >
          logout
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      className="text-blue-400 text-sm hover:text-blue-300 transition"
    >
      login
    </button>
  )
}
