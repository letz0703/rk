"use client"

import {useAuthContext} from "@/components/context/AuthContext"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({children}: AuthGuardProps) {
  const {user, isAdmin, isLoading, login, logout} = useAuthContext()

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tight text-white">RAINSKISS</h1>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <span className="text-white/40 text-sm">Loading...</span>
            ) : !user ? (
              <button
                onClick={login}
                className="text-sm text-blue-400 hover:text-blue-300 transition underline"
              >
                Login
              </button>
            ) : !isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">Access Denied</span>
                <button
                  onClick={logout}
                  className="text-sm text-red-400 hover:text-red-300 transition underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-sm text-white/40 hover:text-white/60 transition underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {isAdmin ? children : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-white/60">
              <p>Please sign in with an authorized account to access the shop.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}