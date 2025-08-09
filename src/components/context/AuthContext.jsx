// src/components/context/AuthContext.jsx
"use client"

import {login, logout, onUserStateChange} from "@/api/firebase"
import {createContext, useContext, useEffect, useMemo, useState} from "react"

const AuthContext = createContext(null)

export function AuthContextProvider({children}) {
  // undefined = 초기 로딩, null = 비로그인, object = 로그인됨
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const off = onUserStateChange(setUser) // 반드시 unsubscribe 반환해야 함
    return () => {
      if (typeof off === "function") off()
    }
  }, [])

  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID ?? ""

  const value = useMemo(
    () => ({
      user,
      isLoading: user === undefined,
      isAdmin: !!user && String(user.uid) === String(adminUid),
      login,
      logout
    }),
    [user, adminUid]
  )

  // 초기 깜빡임 방지 (원하면 스피너로 교체)
  if (user === undefined) return null

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("AuthContextProvider is missing in the tree.")
  return ctx
}
