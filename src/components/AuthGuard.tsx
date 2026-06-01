"use client"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({children}: AuthGuardProps) {
  // Simplified: no authentication, just render children
  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      {/* Simple Header */}
      <div className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-xl font-black tracking-tight text-white">RAINSKISS</h1>
        </div>
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  )
}