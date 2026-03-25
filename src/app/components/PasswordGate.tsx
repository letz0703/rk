"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/context/AuthContext"

const SESSION_KEY = "member_unlocked"

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthContext()
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setUnlocked(true)
    }
    setReady(true)
  }, [isLoading, user])

  // 인증 확인 전에는 아무것도 렌더링하지 않음
  if (!ready) return null

  if (unlocked) return <>{children}</>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    const res = await fetch("/api/check-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem(SESSION_KEY, "true")
      setUnlocked(true)
    } else {
      setError("비밀번호가 틀렸습니다.")
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-white text-xl font-bold mb-1 text-center">Members Only</h2>
        <p className="text-gray-500 text-sm text-center mb-6">이 페이지는 멤버 전용입니다.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            autoFocus
            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 outline-none focus:border-white/30 transition"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !password}
            className="bg-white text-black font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition disabled:opacity-40"
          >
            {submitting ? "확인 중..." : "입장"}
          </button>
        </form>
      </div>
    </div>
  )
}
