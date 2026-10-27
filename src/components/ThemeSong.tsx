"use client"

import { useEffect, useRef, useState } from "react"

// YouTube IFrame API 최소 타입
type YTPlayer = { playVideo(): void; pauseVideo(): void; destroy(): void }
type YTNamespace = {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer
  PlayerState: { PLAYING: number }
}
declare global {
  interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void }
}

export function getYouTubeId(url: string): string | null {
  if (/^[\w-]{11}$/.test(url)) return url
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/)
  return m?.[1] ?? null
}

let apiPromise: Promise<YTNamespace> | null = null
function loadYT(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiPromise) {
    apiPromise = new Promise(resolve => {
      window.onYouTubeIframeAPIReady = () => resolve(window.YT!)
      const s = document.createElement("script")
      s.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(s)
    })
  }
  return apiPromise
}

// 그녀의 주제가 — 화면엔 안 보이는 플레이어 + 하단 고정 미니바.
// 나이 확인 Enter 클릭이 사용자 동작으로 남아 있어 바로 재생된다. 막히면 ▶ 버튼으로 시작.
export default function ThemeSong({ url, title }: { url: string; title: string }) {
  const videoId = getYouTubeId(url)
  const holderRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!videoId || !holderRef.current) return
    let cancelled = false
    const el = document.createElement("div")
    holderRef.current.appendChild(el)
    loadYT().then(YT => {
      if (cancelled) return
      playerRef.current = new YT.Player(el, {
        videoId,
        width: 1,
        height: 1,
        playerVars: { autoplay: 1, loop: 1, playlist: videoId, controls: 0, playsinline: 1 },
        events: {
          onReady: (e: { target: YTPlayer }) => e.target.playVideo(),
          onStateChange: (e: { data: number }) => setPlaying(e.data === YT.PlayerState.PLAYING),
        },
      })
    })
    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
      el.remove()
    }
  }, [videoId])

  if (!videoId) return null

  const toggle = () => {
    if (playing) playerRef.current?.pauseVideo()
    else playerRef.current?.playVideo()
  }

  return (
    <>
      <div ref={holderRef} aria-hidden className="fixed -left-[9999px] top-0 h-px w-px overflow-hidden" />
      <button
        onClick={toggle}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#c10002] py-3 pl-4 pr-6 text-white shadow-2xl shadow-[#c10002]/30 transition hover:brightness-110"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">
          {playing ? "❚❚" : "▶"}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Her Theme</span>
          <span className="max-w-[60vw] truncate text-sm font-bold">{title}</span>
        </span>
      </button>
    </>
  )
}
