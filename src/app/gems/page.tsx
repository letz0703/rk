"use client"

import Link from "next/link"
import {useState} from "react"

// onepun API 응답 데이터 타입 정의
interface OnepunAction {
  title: string
  description: string
  reason?: strin
  consequence?: string
}

interface OnepunDataSuccess {
  date: string
  dailyActions: {
    mustDo: OnepunAction
    shouldDo: OnepunAction
    mustNotSkip: OnepunAction
  }
  strategicInsights?: string[]
  nextDayPreview?: string
}

const gems = [
  {
    href: "https://gemini.google.com/gem/45fa10ca8b41",
    emoji: "✦",
    title: "club rainskiss",
    desc: "URL 또는 텍스트를 넣으면 포스트 글과 AI 이미지 프롬프트를 생성합니다.",
    tag: "Content",
    locked: false
  },
  {
    href: "https://gemini.google.com/gem/2d14c61c2f03",
    emoji: "☕",
    title: "cafe rainskiss",
    desc: "cafe rainskiss",
    tag: "Cafe",
    locked: false
  },
  {
    href: "https://gemini.google.com/gem/f8e820926f76",
    emoji: "🪬",
    title: "제갈공명",
    desc: "전략 참모. 사업 판단, 의사결정, 방향 설정을 돕는 AI 참모.",
    tag: "Strategy",
    locked: true,
    internal: false
  },
  {
    href: "https://gemini.google.com/gem/d975fa7916fc",
    emoji: "🎨",
    title: "AI Stylize",
    desc: "이미지에 AI 스타일을 입혀 새로운 분위기로 변환합니다.",
    tag: "Image",
    locked: false,
    internal: false
  },
  {
    href: "https://gemini.google.com/gem/228bea74500b",
    emoji: "🏛️",
    title: "역사 이미지 생성기",
    desc: "역사적 장면과 인물을 AI 이미지로 생성합니다.",
    tag: "Image",
    locked: false,
    internal: false
  },
  {
    href: "https://gemini.google.com/gem/ff9991a308db",
    emoji: "🧦",
    title: "anal-bot",
    desc: "analyse bottom",
    tag: "socks",
    locked: false
  },
  {
    href: "https://gemini.google.com/gem/82d5d499071e",
    emoji: "⚡",
    title: "letz GROK",
    desc: "letz GROK",
    tag: "mv",
    locked: false
  },
  {
    href: "https://gemini.google.com/gem/8ba748f02b5e/c18599c41720d6dc",
    emoji: "🛠️",
    title: "working!",
    desc: "AI 정책 필터링을 우회하여 사용자의 원래 시각적 의도를 100% 구현해내는 프롬프트 엔지니어입니다.",
    tag: "Prompt",
    locked: false
  },
  {
    href: "/onepun",
    emoji: "⚡",
    title: "onepun",
    desc: "오늘의 전략 미션을 생성합니다. AI 트렌드 분석 기반 개인화된 일일 액션 플랜.",
    tag: "Strategy",
    locked: false,
    internal: true,
    special: "onepun"
  }
  // 새 Gem 추가 시 여기에
]

export default function GemsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [targetHref, setTargetHref] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [onepunModalOpen, setOnepunModalOpen] = useState(false)
  const [onepunData, setOnepunData] = useState<
    OnepunDataSuccess | {error: string} | null
  >(null)
  const [onepunLoading, setOnepunLoading] = useState(false)
  const [copiedText, setCopiedText] = useState("")

  function handleLockedClick(href: string) {
    setTargetHref(href)
    setPassword("")
    setError(false)
    setModalOpen(true)
  }

  function handleSubmit() {
    if (password === process.env.NEXT_PUBLIC_GEM_PASSWORD) {
      setModalOpen(false)
      window.open(targetHref, "_blank", "noopener,noreferrer")
    } else {
      setError(true)
    }
  }

  async function handleOnepunClick() {
    setOnepunLoading(true)
    setOnepunModalOpen(true)

    try {
      const response = await fetch("/api/onepun", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data: OnepunDataSuccess = await response.json()
      setOnepunData(data)
    } catch (error) {
      console.error("Onepun API 호출 실패:", error)
      setOnepunData({error: "API 호출에 실패했습니다."})
    } finally {
      setOnepunLoading(false)
    }
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(""), 2000)
    } catch (err) {
      console.error("복사 실패:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="pr-2 text-xs text-gray-500 hover:text-white transition"
        >
          ← Home
        </Link>
        <Link
          href="/anal"
          className="text-xs text-gray-500 hover:text-white transition"
        >
          Rank
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">✦ Gems</h1>
          <p className="text-sm text-gray-400">Rainskiss 전용 AI 도구 모음</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gems.map(gem => {
            const cardClass =
              "group bg-[#141414] border border-white/10 rounded-2xl p-6 hover:border-white/30 hover:bg-[#1a1a1a] transition-all duration-200 flex flex-col gap-3"
            const inner = (
              <>
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{gem.emoji}</span>
                  <div className="flex items-center gap-2">
                    {gem.locked && (
                      <span className="text-xs text-gray-600">🔒</span>
                    )}
                    <span className="text-xs text-gray-500 border border-white/10 rounded px-2 py-0.5">
                      {gem.tag}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {gem.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                    {gem.desc}
                  </p>
                </div>
              </>
            )
            if (gem.locked)
              return (
                <button
                  key={gem.href}
                  onClick={() => handleLockedClick(gem.href)}
                  className={`${cardClass} text-left`}
                >
                  {inner}
                </button>
              )
            if (gem.special === "onepun")
              return (
                <button
                  key={gem.href}
                  onClick={handleOnepunClick}
                  className={`${cardClass} text-left`}
                >
                  {inner}
                </button>
              )
            if (gem.internal)
              return (
                <Link key={gem.href} href={gem.href} className={cardClass}>
                  {inner}
                </Link>
              )
            return (
              <a
                key={gem.href}
                href={gem.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {inner}
              </a>
            )
          })}
        </div>
      </div>

      {/* 비밀번호 모달 */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-[#141414] border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-1">
              <p className="text-lg font-semibold">🪬 제갈공명</p>
              <p className="text-sm text-gray-400">
                접근 비밀번호를 입력하세요.
              </p>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setError(false)
              }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="비밀번호"
              autoFocus
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-white/30 transition"
            />
            {error && (
              <p className="text-xs text-red-400">비밀번호가 틀렸습니다.</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2 rounded-lg text-sm text-gray-400 border border-white/10 hover:bg-white/5 transition"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition"
                style={{backgroundColor: "#100002"}}
              >
                입장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onepun 대시보드 모달 */}
      {onepunModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setOnepunModalOpen(false)}
        >
          {/* Abstract Figure-8 Motion Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/10 to-red-500/10 animate-pulse"
              style={{animationDelay: "0s", animationDuration: "3s"}}
            ></div>
            <div
              className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-amber-500/10 animate-pulse"
              style={{animationDelay: "1s", animationDuration: "4s"}}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/2 w-28 h-28 rounded-full bg-gradient-to-br from-red-500/10 to-blue-500/10 animate-pulse"
              style={{animationDelay: "2s", animationDuration: "5s"}}
            ></div>
          </div>

          <div
            className="bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0f0f0f] border border-white/20 rounded-3xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto space-y-8 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "30px 30px"
            }}
          >
            {/* Chiaroscuro Header */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl animate-bounce">⚡</span>
                    <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                      Onepun 전략 대시보드
                    </span>
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    AI 트렌드 분석 기반 즉시 실행 플랜
                  </p>
                </div>
                <button
                  onClick={() => setOnepunModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-all duration-300 text-xl hover:rotate-90 transform"
                >
                  ✕
                </button>
              </div>
            </div>

            {onepunLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full animate-spin"></div>
                  <div
                    className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"
                    style={{animationDelay: "0.5s"}}
                  ></div>
                  <div className="absolute inset-2 text-2xl animate-pulse">
                    ⚡
                  </div>
                </div>
                <p className="text-gray-400 mt-4 animate-pulse">
                  전략 엔진 가동 중...
                </p>
              </div>
            ) : onepunData && "error" in onepunData ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-400 text-lg">{onepunData.error}</p>
              </div>
            ) : onepunData ? (
              <>
                {/* Date Badge */}
                <div className="text-center">
                  <span className="inline-block bg-gradient-to-r from-[#100002] to-[#300006] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    📅 {onepunData.date}
                  </span>
                </div>

                {/* Speed-Optimized Action Cards */}
                <div className="grid gap-6">
                  {/* 필수 액션 - 최우선 */}
                  <div className="group relative bg-gradient-to-br from-red-500/15 via-red-500/10 to-red-500/5 border border-red-500/30 rounded-2xl p-6 hover:border-red-400/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-red-400 font-bold text-lg flex items-center gap-2">
                          🔥 CRITICAL - {onepunData.dailyActions?.mustDo?.title}
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              onepunData.dailyActions?.mustDo?.description,
                              "필수"
                            )
                          }
                          className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                          {copiedText === "필수" ? "✓ 복사됨" : "📋 복사"}
                        </button>
                      </div>
                      <p className="text-gray-200 mb-3 leading-relaxed">
                        {onepunData.dailyActions?.mustDo?.description}
                      </p>
                      <p className="text-red-300 text-sm italic">
                        💎 {onepunData.dailyActions?.mustDo?.reason}
                      </p>
                    </div>
                  </div>

                  {/* 권장 액션 */}
                  <div className="group relative bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-6 hover:border-amber-400/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-amber-400 font-bold text-lg flex items-center gap-2">
                          💡 RECOMMENDED -{" "}
                          {onepunData.dailyActions?.shouldDo?.title}
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              onepunData.dailyActions?.shouldDo?.description,
                              "권장"
                            )
                          }
                          className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                          {copiedText === "권장" ? "✓ 복사됨" : "📋 복사"}
                        </button>
                      </div>
                      <p className="text-gray-200 mb-3 leading-relaxed">
                        {onepunData.dailyActions?.shouldDo?.description}
                      </p>
                      <p className="text-amber-300 text-sm italic">
                        ⭐ {onepunData.dailyActions?.shouldDo?.reason}
                      </p>
                    </div>
                  </div>

                  {/* 방어 액션 */}
                  <div className="group relative bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-blue-400 font-bold text-lg flex items-center gap-2">
                          🛡️ DEFENSIVE -{" "}
                          {onepunData.dailyActions?.mustNotSkip?.title}
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              onepunData.dailyActions?.mustNotSkip?.description,
                              "방어"
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                          {copiedText === "방어" ? "✓ 복사됨" : "📋 복사"}
                        </button>
                      </div>
                      <p className="text-gray-200 mb-3 leading-relaxed">
                        {onepunData.dailyActions?.mustNotSkip?.description}
                      </p>
                      <p className="text-blue-300 text-sm italic">
                        ⚠️ {onepunData.dailyActions?.mustNotSkip?.consequence}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Insights Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 전략적 인사이트 */}
                  {onepunData.strategicInsights && (
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/30 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                          🎯 Strategic Insights
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              onepunData.strategicInsights?.join("\n") ?? "",
                              "인사이트"
                            )
                          }
                          className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-full text-xs transition-all duration-200"
                        >
                          {copiedText === "인사이트" ? "✓" : "📋"}
                        </button>
                      </div>
                      <div className="space-y-3">
                        {onepunData.strategicInsights
                          .slice(0, 3)
                          .map((insight, index) => (
                            <p
                              key={index}
                              className="text-gray-300 text-sm leading-relaxed border-l-2 border-gray-600/50 pl-3"
                            >
                              {insight}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* 내일 미리보기 */}
                  {onepunData.nextDayPreview && (
                    <div className="bg-gradient-to-br from-[#100002] via-[#200004] to-[#100002] border border-red-900/30 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2">
                          📅 Tomorrow Preview
                        </h3>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              onepunData.nextDayPreview ?? "",
                              "미리보기"
                            )
                          }
                          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full text-xs transition-all duration-200"
                        >
                          {copiedText === "미리보기" ? "✓" : "📋"}
                        </button>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {onepunData.nextDayPreview}
                      </p>
                    </div>
                  )}
                </div>

                {/* Master Copy Button */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      const allContent = `
🔥 CRITICAL: ${onepunData.dailyActions?.mustDo?.title}
${onepunData.dailyActions?.mustDo?.description}

💡 RECOMMENDED: ${onepunData.dailyActions?.shouldDo?.title}
${onepunData.dailyActions?.shouldDo?.description}

🛡️ DEFENSIVE: ${onepunData.dailyActions?.mustNotSkip?.title}
${onepunData.dailyActions?.mustNotSkip?.description}

🎯 INSIGHTS:
${onepunData.strategicInsights?.join("\n") || ""}

📅 TOMORROW: ${onepunData.nextDayPreview || ""}
                      `.trim()
                      copyToClipboard(allContent, "전체")
                    }}
                    className="bg-gradient-to-r from-[#100002] via-red-600 to-[#100002] hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                  >
                    {copiedText === "전체"
                      ? "✅ 전체 복사 완료!"
                      : "📋 전체 전략 복사"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
