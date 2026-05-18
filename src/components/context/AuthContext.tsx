"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { auth } from "@/api/firebase"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  login: () => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAdmin: false,
  login: async () => null,
  logout: async () => {},
})

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID ?? ""

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setIsLoading(false)
    })
    return () => unsub()
  }, [])

  async function login() {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.uid === ADMIN_UID,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
