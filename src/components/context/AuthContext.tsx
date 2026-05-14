"use client"

import { ReactNode } from "react"

type AuthContextValue = {
  user: null
  isLoading: false
  isAdmin: false
  login: () => Promise<any>
  logout: () => Promise<void>
}

const defaultValue: AuthContextValue = {
  user: null,
  isLoading: false,
  isAdmin: false,
  login: async () => null,
  logout: async () => {}
}

export function AuthContextProvider({children}: {children: ReactNode}) {
  // 로그인 기능 완전 비활성화 - 바로 children 렌더링
  return <>{children}</>
}

export function useAuthContext(): AuthContextValue {
  // 로그인 기능 없이 기본값 반환
  return defaultValue
}