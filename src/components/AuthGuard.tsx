"use client"

import HeaderAuth from "@/app/components/HeaderAuth"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({children}: AuthGuardProps) {
  // Simplified: no authentication, just render children
  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      {/* Simple Header */}
      <div className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
        {/* 편집 UI 전체가 isAdmin 뒤에 있는데 이 헤더에 로그인 버튼이 없어서
            상품 페이지에서 admin이 될 방법이 없었다. HeaderAuth를 붙여 그 구멍을 막는다. */}
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-black tracking-tight text-white">RAINSKISS</h1>
          <HeaderAuth />
        </div>
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  )
}