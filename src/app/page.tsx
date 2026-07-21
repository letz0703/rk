"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"

const ACCENT = "#c10002"

export default function HomePage() {
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "oz") {
      router.push("/oz")
    } else if (password === "zo") {
      router.push("/zo")
    } else if (password === "ic") {
      router.push("/ic")
    } else if (password === "shop") {
      router.push("/shop")
    } else {
      router.push("/mv")
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/95 px-6">
      {/* 암호 입력 팝업 */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl"
      >
        <div
          className="mb-6 text-center text-[10px] font-black uppercase tracking-[0.4em]"
          style={{color: ACCENT}}
        >
          RAINSKISS
        </div>

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="ENTER PASSWORD"
          autoFocus
          className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-center text-sm uppercase tracking-[0.2em] text-white placeholder-white/30 outline-none transition-colors focus:border-[#c10002]"
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-lg py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-0.5"
          style={{backgroundColor: ACCENT}}
        >
          Enter
        </button>
      </form>
    </div>
  )
}
