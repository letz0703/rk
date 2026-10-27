"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"

// 회원 = 이메일 + 개인 비번 / VVIP = DA 구독자 게시물의 공용 비번
export default function XLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"member" | "vvip">("member")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const res = await fetch("/api/studiox/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({mode, email, password})
    })
    if (res.ok) {
      router.push("/studiox/stories")
      router.refresh()
    } else {
      setError("비밀번호가 맞지 않습니다.")
    }
  }

  return (
    <form onSubmit={login} className="mx-auto max-w-sm space-y-5 py-10">
      <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-white/15 text-sm">
        {(["member", "vvip"] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={mode === m ? "bg-rose-600 py-3 font-bold" : "py-3 text-neutral-400"}
          >
            {m === "member" ? "채택 회원" : "VVIP"}
          </button>
        ))}
      </div>

      {mode === "member" && (
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="이메일"
          className="w-full rounded-lg border border-white/15 bg-white/5 p-4 outline-none focus:border-rose-500"
        />
      )}
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder={mode === "member" ? "받으신 비밀번호" : "VVIP 비밀번호"}
        className="w-full rounded-lg border border-white/15 bg-white/5 p-4 outline-none focus:border-rose-500"
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <button type="submit" className="w-full rounded-lg bg-rose-600 py-4 font-bold">입장</button>
    </form>
  )
}
