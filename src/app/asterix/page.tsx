"use client"

import {useEffect, useRef, useState} from "react"

/* ============================================================
   ASTERIX — Premium Interior Design Agency (디자인 레퍼런스 클론)
   다크/화이트 하이콘트라스트 · 거대 타이포 · 머스타드 포인트
   이미지는 전부 placeholder (사용자가 후에 투입)
   ============================================================ */

const ACCENT = "#D4A373"

/* 스크롤 리빌: 뷰포트 진입 시 fade-in + translateY */
function Reveal({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setShown(true)
            io.unobserve(e.target)
          }
        })
      },
      {threshold: 0.15}
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(40px)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`
      }}
    >
      {children}
    </div>
  )
}

/* 이미지 placeholder 블록 */
function Placeholder({
  label,
  className = "",
  zoom = false
}: {
  label?: string
  className?: string
  zoom?: boolean
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className={`h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-300 ${
          zoom ? "transition-transform duration-[400ms] ease-out group-hover:scale-105" : ""
        }`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(0,0,0,.03) 0 12px, transparent 12px 24px)"
        }}
      />
      {label && (
        <span className="pointer-events-none absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </span>
      )}
    </div>
  )
}

const NAV = ["Work", "Studio", "Services", "Journal"]

const PORTFOLIO = [
  {name: "Maison Noir", area: "240 M²", h: "h-[420px]"},
  {name: "Atelier Lumen", area: "180 M²", h: "h-[300px]"},
  {name: "Villa Serra", area: "320 M²", h: "h-[360px]"},
  {name: "Kinfolk Loft", area: "150 M²", h: "h-[460px]"},
  {name: "Onsen House", area: "210 M²", h: "h-[320px]"},
  {name: "Brutalist No.7", area: "280 M²", h: "h-[400px]"}
]

const STYLES = ["Bohemian", "Scandinavian", "Japandi", "Mid-Century", "Brutalist", "Art Deco"]

const PROCESS = [
  {step: "01", title: "Consultation", desc: "공간과 라이프스타일 진단"},
  {step: "02", title: "Concept", desc: "무드보드 · 3D 아이소메트릭 설계"},
  {step: "03", title: "Curation", desc: "소재 · 가구 · 조명 큐레이션"},
  {step: "04", title: "Delivery", desc: "시공 감리 및 스타일링 완성"}
]

const FAQ = [
  {q: "프로젝트 진행 기간은 얼마나 걸리나요?", a: "규모에 따라 6주에서 6개월까지 소요됩니다. 컨설팅 단계에서 정확한 일정을 산정합니다."},
  {q: "예산은 어떻게 책정되나요?", a: "공간 평수, 소재 등급, 가구 큐레이션 범위에 따라 맞춤 견적을 제공합니다."},
  {q: "원격으로도 협업이 가능한가요?", a: "3D 설계와 화상 컨설팅으로 전 세계 어디서든 협업합니다."},
  {q: "기존 가구를 활용할 수 있나요?", a: "물론입니다. 보유 가구를 진단하여 새 공간에 통합하는 큐레이션을 제안합니다."}
]

export default function AsterixPage() {
  const [introDone, setIntroDone] = useState(false)
  const [hoverStyle, setHoverStyle] = useState<number | null>(null)
  const [slide, setSlide] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A1A] antialiased">
      {/* ===== Header ===== */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
          <span
            className="text-sm font-semibold uppercase text-white mix-blend-difference"
            style={{
              letterSpacing: introDone ? "0.5em" : "0.1em",
              transition: "letter-spacing 1.4s cubic-bezier(.16,1,.3,1)"
            }}
          >
            ASTERIX
          </span>
          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map(n => (
              <a
                key={n}
                href="#"
                className="text-xs uppercase tracking-[0.18em] text-white mix-blend-difference transition-opacity hover:opacity-60"
              >
                {n}
              </a>
            ))}
          </nav>
          <button
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A] transition-transform hover:-translate-y-0.5"
            style={{backgroundColor: ACCENT}}
          >
            Consultation
          </button>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative flex h-screen flex-col justify-center overflow-hidden bg-[#111111] text-white">
        {/* 은은한 배경 placeholder */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(120% 80% at 70% 20%, rgba(212,163,115,.18), transparent 60%)"
          }}
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <h1
            className="font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 11rem)",
              opacity: introDone ? 1 : 0,
              transform: introDone ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 1.2s ease .2s, transform 1.2s cubic-bezier(.16,1,.3,1) .2s"
            }}
          >
            Living{" "}
            <span style={{color: ACCENT}} className="font-serif italic font-normal">
              &amp;
            </span>{" "}
            Function
          </h1>
        </div>
        {/* 하단 보조 텍스트 */}
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1400px] px-6 pb-10 md:px-10">
          <div className="flex items-end justify-between">
            <p className="max-w-xs text-xs leading-relaxed tracking-wide text-[#CCCCCC]">
              공간을 디자인하는 것이 아니라 삶의 방식을 설계합니다. 서울 · 부산 · 도쿄.
            </p>
            <div className="text-right">
              <div className="text-sm" style={{color: ACCENT}}>
                ★★★★★
              </div>
              <p className="mt-1 text-xs tracking-wide text-[#CCCCCC]">
                4.9 / 320+ 프로젝트
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Mission ===== */}
      <section className="relative overflow-hidden bg-white px-6 py-32 md:px-10">
        {/* 추상 곡선 워터마크 */}
        <svg
          className="pointer-events-none absolute right-0 top-10 h-[480px] w-[480px] opacity-[0.06]"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M20 120 C 60 20, 140 20, 180 120 S 120 220, 60 160"
            stroke="#1A1A1A"
            strokeWidth="1.5"
          />
          <circle cx="100" cy="100" r="70" stroke="#1A1A1A" strokeWidth="1" />
        </svg>
        <div className="relative mx-auto max-w-[1400px]">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[#888888]">
              — Our Mission
            </p>
            <h2
              className="max-w-4xl font-semibold leading-[1.05] tracking-[-0.02em]"
              style={{fontSize: "clamp(2rem, 5vw, 4.5rem)"}}
            >
              여백과 빛, 그리고 절제된 디테일로 시간이 지날수록 깊어지는 공간을 만듭니다.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-16 grid grid-cols-3 gap-4 md:max-w-2xl">
              {["Concept", "Material", "Atelier"].map(l => (
                <Placeholder key={l} label={l} zoom className="aspect-[4/3] rounded-sm" />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Portfolio ===== */}
      <section className="bg-white px-6 pb-32 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <h2
              className="mb-16 font-semibold leading-[0.9] tracking-[-0.03em]"
              style={{fontSize: "clamp(2.5rem, 7vw, 6rem)"}}
            >
              The Form of
              <br />
              <span style={{color: ACCENT}} className="font-serif italic font-normal">
                Interior
              </span>{" "}
              Design
            </h2>
          </Reveal>
          {/* 비대칭 staggered 그리드 */}
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {PORTFOLIO.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 0.1} className="mb-6 break-inside-avoid">
                <Placeholder label="PROJECT" zoom className={`w-full ${p.h} rounded-sm`} />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs tracking-wide text-[#888888]">{p.area}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Styles (interactive) ===== */}
      <section className="relative overflow-hidden bg-white px-6 py-40 md:px-10">
        {/* hover 시 페이드인되는 배경 placeholder */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{opacity: hoverStyle !== null ? 0.5 : 0}}
        >
          <div
            className="h-[60vh] w-[40vw] rounded-sm"
            style={{
              background:
                "linear-gradient(135deg, #d4a373 0%, #7a6a55 100%)",
              filter: "saturate(.8)"
            }}
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] text-center">
          <p className="mb-12 text-xs uppercase tracking-[0.3em] text-[#888888]">
            — Signature Styles
          </p>
          <ul>
            {STYLES.map((s, i) => (
              <li key={s}>
                <button
                  onMouseEnter={() => setHoverStyle(i)}
                  onMouseLeave={() => setHoverStyle(null)}
                  className="block w-full py-2 font-semibold leading-[1.05] tracking-[-0.02em] transition-all duration-300"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 5rem)",
                    color: hoverStyle === i ? "#1A1A1A" : "#DDDDDD",
                    transform: hoverStyle === i ? "scale(1.02)" : "scale(1)"
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Process carousel ===== */}
      <section className="bg-[#F4F2EE] px-6 py-32 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="mb-12 text-xs uppercase tracking-[0.3em] text-[#888888]">
              — The Process
            </p>
          </Reveal>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
              style={{transform: `translateX(-${slide * 100}%)`}}
            >
              {PROCESS.map(p => (
                <div key={p.step} className="w-full shrink-0 md:w-1/2 md:pr-6">
                  <div className="flex items-center gap-6">
                    <Placeholder
                      label="ISOMETRIC"
                      className="aspect-square w-40 shrink-0 rounded-sm md:w-56"
                    />
                    <div>
                      <span className="text-sm font-semibold" style={{color: ACCENT}}>
                        {p.step}
                      </span>
                      <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{p.title}</h3>
                      <p className="mt-2 max-w-xs text-sm text-[#888888]">{p.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 컨트롤 */}
          <div className="mt-12 flex items-center justify-between">
            <div className="flex gap-2">
              {PROCESS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: slide === i ? 28 : 8,
                    backgroundColor: slide === i ? ACCENT : "#CCCCCC"
                  }}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSlide(s => Math.max(0, s - 1))}
                className="flex h-11 w-11 items-center justify-center border border-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
              >
                ←
              </button>
              <button
                onClick={() => setSlide(s => Math.min(PROCESS.length - 1, s + 1))}
                className="flex h-11 w-11 items-center justify-center border border-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-[#111111] px-6 py-32 text-white md:px-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "repeating-linear-gradient(45deg, rgba(255,255,255,.02) 0 14px, transparent 14px 28px)"
          }}
        />
        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-2">
          <div className="hidden md:block" />
          <Reveal>
            <blockquote
              className="font-serif leading-[1.2] tracking-[-0.01em]"
              style={{fontSize: "clamp(1.6rem, 3vw, 2.6rem)"}}
            >
              “집이 아니라 하나의 작품을 받았습니다. 빛이 머무는 방식까지 설계된 공간이에요.”
            </blockquote>
            <div className="mt-8">
              <p className="text-sm font-semibold">— 김 · Villa Serra</p>
              <p className="mt-1 text-xs tracking-wide text-[#CCCCCC]">Private Residence, Seoul</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-[#111111] px-6 py-32 text-white md:px-10">
        <div className="mx-auto max-w-[1000px]">
          <Reveal>
            <h2
              className="mb-16 font-semibold tracking-[-0.02em]"
              style={{fontSize: "clamp(2rem, 5vw, 4rem)"}}
            >
              Questions
            </h2>
          </Reveal>
          <div className="border-t border-white/15">
            {FAQ.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={i} className="border-b border-white/15">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-medium md:text-xl">{f.q}</span>
                    <span
                      className="shrink-0 text-2xl transition-transform duration-300"
                      style={{color: ACCENT, transform: open ? "rotate(180deg)" : "none"}}
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{maxHeight: open ? 200 : 0, opacity: open ? 1 : 0}}
                  >
                    <p className="pb-6 pr-12 text-sm leading-relaxed text-[#CCCCCC]">{f.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#111111] px-6 pb-12 pt-8 text-white md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div
            className="select-none font-semibold leading-none tracking-[-0.04em] text-white"
            style={{fontSize: "clamp(3.5rem, 18vw, 18rem)"}}
          >
            ASTERIX
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/15 pt-10 md:grid-cols-4">
            {[
              ["Email", "studio@asterix.design"],
              ["Location", "Seoul · Busan · Tokyo"],
              ["Time Zone", "GMT+9 (KST)"],
              ["Social", "Instagram · Behance"]
            ].map(([k, v]) => (
              <div key={k}>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#888888]">{k}</p>
                <p className="text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
