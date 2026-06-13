"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"

const ACCENT = "#c10002"

export default function HomePage() {
  const [password, setPassword] = useState("")
  const [intro, setIntro] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => setIntro(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "oz") {
      router.push("/oz")
    } else if (password === "zo") {
      router.push("/zo")
    } else if (password === "ic") {
      router.push("/ic")
    } else {
      // 잘못된/미인증 암호 → 뮤직 비디오 페이지로 바로 이동
      router.push("/mv")
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#111111] font-sans text-white antialiased">
      {/* 미세 텍스처 + 레드 광원 (이미지 없이 색상만) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120% 80% at 80% 15%, rgba(193,0,2,.16), transparent 55%)"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 14px, transparent 14px 28px)"
        }}
      />

      {/* 상단 로고 */}
      <header className="relative z-10 px-6 py-6 md:px-10">
        <span
          className="text-xs font-semibold uppercase"
          style={{
            letterSpacing: intro ? "0.5em" : "0.1em",
            transition: "letter-spacing 1.4s cubic-bezier(.16,1,.3,1)"
          }}
        >
          RAINSKISS
        </span>
      </header>

      {/* 거대 타이포 + 입장 폼 */}
      <main className="relative z-10 flex flex-1 items-center px-6 md:px-10">
        <div className="mx-auto w-full max-w-[1400px] text-center">
          <p
            className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50"
            style={{
              opacity: intro ? 1 : 0,
              transition: "opacity 1s ease .3s"
            }}
          >
            — Private Access
          </p>

          <h1
            className="font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
              opacity: intro ? 1 : 0,
              transform: intro ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 1.2s ease .2s, transform 1.2s cubic-bezier(.16,1,.3,1) .2s"
            }}
          >
            RAINS{" "}
            <span
              aria-label="RK logo"
              role="img"
              style={{
                display: "inline-block",
                width: "0.85em",
                height: "0.85em",
                verticalAlign: "-0.08em",
                backgroundColor: ACCENT,
                WebkitMaskImage: "url(/logo-rk.svg)",
                maskImage: "url(/logo-rk.svg)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center"
              }}
            />{" "}
            KISS
          </h1>

          {/* 입장 폼 — 미니멀 언더라인 */}
          <form
            onSubmit={handlePasswordSubmit}
            className="mx-auto mt-14 flex max-w-md items-center gap-4 border-b border-white/20 pb-3"
            style={{
              opacity: intro ? 1 : 0,
              transition: "opacity 1s ease .5s"
            }}
          >
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="ENTER PASSWORD"
              autoFocus
              className="w-full bg-transparent text-center text-sm uppercase tracking-[0.2em] text-white placeholder-white/30 outline-none"
            />
            <button
              type="submit"
              className="shrink-0 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-0.5"
              style={{backgroundColor: ACCENT}}
            >
              Enter
            </button>
          </form>
        </div>
      </main>

      {/* 하단 정보 */}
      <footer className="relative z-10 px-6 pb-8 md:px-10">
        <div className="mx-auto flex w-full max-w-[1400px] items-end justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <p className="max-w-xs text-xs leading-relaxed tracking-wide text-white/40">
              AI 패션 하우스. 멤버 전용 큐레이션 공간.
            </p>
            <Link 
              href="/mv" 
              className="text-xs font-semibold tracking-wider text-[#c10002] hover:underline hover:text-red-400 transition-colors"
            >
              Music Videos →
            </Link>
          </div>
          <p className="text-xs tracking-wide text-white/40">Seoul · GMT+9</p>
        </div>
      </footer>
    </div>
  )
}
