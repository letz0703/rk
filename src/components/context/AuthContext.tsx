"use client"

import {login, logout, onUserStateChange} from "@/api/firebase"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from "react"
import type {User} from "firebase/auth"

type AuthContextValue = {
  user: User | null // null=비로그인, User=로그인
  isLoading: boolean
  isAdmin: boolean
  login: typeof login
  logout: typeof logout
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthContextProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const off = onUserStateChange(setUser)
    return () => {
      if (typeof off === "function") off()
    }
  }, [])

  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID ?? ""

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading: user === undefined,
      isAdmin: !!user && String(user.uid) === String(adminUid),
      login,
      logout
    }),
    [user, adminUid]
  )

  if (user === undefined) return null
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("AuthContextProvider is missing in the tree.")
  return ctx
}
