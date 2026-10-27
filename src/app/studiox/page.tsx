"use client"

import {useState} from "react"

// 입구 — 고민 + 이메일 + 동의 3개. 채택되면 개인 비번이 이메일로 간다.
export default function XEntryPage() {
  const [email, setEmail] = useState("")
  const [text, setText] = useState("")
  const [adult, setAdult] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [adapt, setAdapt] = useState(false)
  const [website, setWebsite] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")

  const ready = email && text.trim().length >= 10 && adult && privacy && adapt

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setState("sending")
    const res = await fetch("/api/studiox/submit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, text, adult, privacy, adapt, website})
    })
    setState(res.ok ? "done" : "error")
  }

  if (state === "done") {
    return (
      <div className="py-20 text-center">
        <p className="text-3xl font-bold">접수되었습니다.</p>
        <p className="mt-4 text-neutral-400">채택되면 남기신 이메일로 입장 비밀번호를 보내 드립니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="py-6 text-center">
        <p className="text-sm tracking-[0.4em] text-rose-500">한번 주면 해결해 드립니다</p>
        <h1 className="mt-3 text-4xl font-black">당신의 고민은?</h1>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={8}
        maxLength={5000}
        placeholder="누구에게도 못 한 이야기를 적어 주세요. (10자 이상)"
        className="w-full rounded-lg border border-white/15 bg-white/5 p-4 outline-none focus:border-rose-500"
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="이메일 (채택 시 비밀번호를 보내 드립니다)"
        className="w-full rounded-lg border border-white/15 bg-white/5 p-4 outline-none focus:border-rose-500"
      />
      {/* 봇 함정 — 화면에 안 보임 */}
      <input
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden
      />

      <div className="space-y-3 text-sm text-neutral-300">
        <Check checked={adult} onChange={setAdult}>만 19세 이상입니다.</Check>
        <Check checked={privacy} onChange={setPrivacy}>
          이메일 수집에 동의합니다. 목적: 채택 시 입장 비밀번호 전달. 보관: 탈퇴·삭제 요청 시까지. 삭제 요청은 이메일로 받습니다.
        </Check>
        <Check checked={adapt} onChange={setAdapt}>
          제 고민이 각색되어 가상 인물의 이야기로 실릴 수 있음에 동의합니다. 이름·이메일 등 신상은 어떤 경우에도 공개되지 않습니다.
        </Check>
      </div>

      {state === "error" && <p className="text-sm text-rose-400">전송에 실패했습니다. 입력을 확인해 주세요.</p>}

      <button
        type="submit"
        disabled={!ready || state === "sending"}
        className="w-full rounded-lg bg-rose-600 py-4 font-bold transition disabled:opacity-30"
      >
        {state === "sending" ? "보내는 중…" : "고민 보내기"}
      </button>
    </form>
  )
}

function Check({checked, onChange, children}: {checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="mt-1 accent-rose-600" />
      <span>{children}</span>
    </label>
  )
}
