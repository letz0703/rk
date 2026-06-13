"use client"

import Link from "next/link"

const ACCENT = "#c10002"

// 공개 안내 페이지 — 미인증/잘못된 암호 방문자가 도달하는 일반 랜딩
export default function PublicLandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#111111] font-sans text-white antialiased">
      {/* 히어로 이미지 + 다크 오버레이 */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-image.jpeg"
          alt="RAINSKISS"
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/70 via-[#111111]/40 to-[#111111]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 md:px-10">
        <Link href="/" className="text-xs font-semibold uppercase tracking-[0.4em]">
          RAINSKISS
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 items-center px-6 md:px-10">
        <div className="mx-auto w-full max-w-[1400px] text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em]" style={{color: ACCENT}}>
            Mathematical Beauty · Divine Proportion
          </p>
          <h1
            className="font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{fontSize: "clamp(3rem, 11vw, 9rem)"}}
          >
            AI{" "}
            <span style={{color: ACCENT}} className="font-serif font-normal italic">
              Fashion
            </span>
          </h1>
          <p className="mt-8 text-xs uppercase tracking-[0.5em] text-white/70">
            Look &amp; Sound
          </p>

          <div className="mt-16 border-t border-white/10 pt-8">
            <p className="text-xs tracking-wider text-white/30">
              Special collections available for authorized users
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/"
                className="inline-block w-full sm:w-auto px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-0.5 text-center"
                style={{backgroundColor: ACCENT}}
              >
                Member Access
              </Link>
              <Link
                href="/mv"
                className="inline-block w-full sm:w-auto px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 border border-white/20 transition-transform hover:-translate-y-0.5 hover:bg-white/5 text-center"
              >
                Watch Music Videos
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 pb-8 md:px-10">
        <div className="mx-auto max-w-[1400px] text-center">
          <p className="text-xs tracking-wide text-white/30">
            © 2026 RAINSKISS · Mathematical Fashion Design
          </p>
        </div>
      </footer>
    </div>
  )
}
