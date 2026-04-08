"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { onApprovedLifeSongs, submitLifeSong } from "../../api/firebase"

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

export default function LifeSongPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [daily, setDaily] = useState<Song | null>(null)

  // form
  const [name, setName] = useState("")
  const [songTitle, setSongTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [story, setStory] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = onApprovedLifeSongs((list: Song[]) => {
      setSongs(list)
      setDaily(getDailySong(list))
    })
    return unsub
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!songTitle.trim() || !story.trim()) return
    setLoading(true)
    await submitLifeSong({ name, songTitle, artist, youtubeUrl, story })
    setSent(true)
    setLoading(false)
  }

  const ytId = daily?.youtubeUrl ? getYouTubeId(daily.youtubeUrl) : null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-white text-sm transition">← Home</Link>
        <span className="text-white/20">/</span>
        <span className="text-white text-sm font-semibold">인생곡</span>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Life Song of the Day</p>
          <h1 className="text-4xl font-extrabold text-yellow-400">당신의 인생곡은?</h1>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            평생 곁에 있었던 노래, 특별한 순간을 담은 곡.<br />
            당신의 사연과 함께 매일 한 곡씩 여기서 흘러나옵니다.
          </p>
        </div>

        {/* Today's Song */}
        {daily ? (
          <section className="mb-14">
            <div className="bg-gray-800/60 border border-white/10 rounded-2xl overflow-hidden">
              {ytId && (
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">{daily.songTitle}</h2>
                    <p className="text-orange-400 text-sm mt-0.5">{daily.artist}</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 mt-1">by {daily.name}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line border-t border-white/10 pt-4 mt-2">
                  {daily.story}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-14 text-center py-12 border border-dashed border-white/20 rounded-2xl">
            <p className="text-gray-500 text-sm">아직 등록된 인생곡이 없어요.<br />첫 번째 사연을 남겨주세요.</p>
          </section>
        )}

        {/* 제출 폼 */}
        <section>
          <h2 className="text-lg font-bold text-white mb-1">내 인생곡 등록하기</h2>
          <p className="text-gray-500 text-xs mb-6">검토 후 승인되면 이 페이지에서 하루 동안 소개됩니다.</p>

          {sent ? (
            <div className="bg-green-900/40 border border-green-600/50 rounded-2xl p-8 text-center">
              <p className="text-2xl mb-2">🎵</p>
              <p className="text-green-300 font-semibold">사연이 접수됐어요!</p>
              <p className="text-gray-400 text-sm mt-2">검토 후 곧 소개될 거예요. 감사합니다.</p>
              <button
                onClick={() => { setSent(false); setName(""); setSongTitle(""); setArtist(""); setYoutubeUrl(""); setStory("") }}
                className="mt-6 px-5 py-2 rounded-full border border-white/20 text-sm hover:bg-white/10 transition"
              >
                다른 곡 등록하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">곡 제목 *</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={e => setSongTitle(e.target.value)}
                    placeholder="예: 봄날"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">아티스트</label>
                  <input
                    type="text"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    placeholder="예: BTS"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">YouTube 링크 (선택)</label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">사연 *</label>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="이 노래가 인생곡이 된 이유, 특별한 기억이나 순간을 적어주세요."
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">이름 / 닉네임 (선택)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="익명으로 남겨도 괜찮아요"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !songTitle.trim() || !story.trim()}
                className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "등록 중..." : "인생곡 등록하기"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}
