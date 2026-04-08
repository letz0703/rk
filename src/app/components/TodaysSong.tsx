"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { onApprovedLifeSongs } from "../../api/firebase"

type Song = {
  id: string
  name: string
  songTitle: string
  artist: string
  youtubeUrl: string
  story: string
  createdAt: number
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  return match?.[1] ?? null
}

function getDailySong(songs: Song[]): Song | null {
  if (!songs.length) return null
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  return songs[day % songs.length]
}

export default function TodaysSong() {
  const [daily, setDaily] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onApprovedLifeSongs((list: Song[]) => {
      setDaily(getDailySong(list))
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading || !daily) return null

  const ytId = daily.youtubeUrl ? getYouTubeId(daily.youtubeUrl) : null

  return (
    <section className="border-t border-white/5 px-6 py-14">
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-6">
          Today&apos;s Life Song
        </p>

        <div className="bg-gray-800/50 border border-white/10 rounded-2xl overflow-hidden">
          {ytId && (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${ytId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-white font-bold">{daily.songTitle}</h3>
                <p className="text-orange-400 text-xs mt-0.5">{daily.artist}</p>
              </div>
              <span className="text-xs text-gray-500 shrink-0 mt-1">by {daily.name}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{daily.story}</p>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link
            href="/lifesong"
            className="text-xs text-gray-500 hover:text-yellow-400 transition"
          >
            당신의 인생곡을 등록하세요 →
          </Link>
        </div>
      </div>
    </section>
  )
}
