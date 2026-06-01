"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "oz") {
      router.push("/oz")
    } else if (password === "zo") {
      router.push("/zo")
    } else if (password === "ic") {
      router.push("/ic")
    } else {
      alert("잘못된 암호입니다")
      setPassword("")
    }
  }

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2">RAINSKISS</h1>
          <p className="text-white/60 text-sm">Private Access</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c10002]"
            autoFocus
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-[#c10002] hover:bg-[#a00001] text-white rounded-lg transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}