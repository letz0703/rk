"use client"

import Link from "next/link"
import {useState} from "react"

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
  }
  // 새 Gem 추가 시 여기에
]

export default function GemsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [targetHref, setTargetHref] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

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
    </div>
  )
}
