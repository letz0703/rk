"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/context/AuthContext"
import { onAllLifeSongs, approveLifeSong, deleteLifeSong } from "../../../api/firebase"

type Song = {
  id: string
  name: string
  songTitle: string
  artist: string
  youtubeUrl: string
  story: string
  approved: boolean
  createdAt: number
}

export default function LifeSongAdminPage() {
  const { user } = useAuthContext()
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID
  const isAdmin = user?.uid === adminUid

  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    if (!isAdmin) return
    const unsub = onAllLifeSongs((list: Song[]) => setSongs(list))
    return unsub
  }, [isAdmin])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">로그인이 필요합니다.</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">관리자만 접근할 수 있습니다.</p>
      </div>
    )
  }

  const pending = songs.filter(s => !s.approved)
  const approved = songs.filter(s => s.approved)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">인생곡 관리</h1>
        <p className="text-gray-500 text-sm mb-10">
          대기 {pending.length}건 · 승인됨 {approved.length}건
        </p>

        {/* 대기 중 */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-4">대기 중</h2>
          {pending.length === 0 ? (
            <p className="text-gray-600 text-sm">대기 중인 사연이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {pending.map(s => (
                <SongCard
                  key={s.id}
                  song={s}
                  onApprove={() => approveLifeSong(s.id)}
                  onDelete={() => deleteLifeSong(s.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 승인됨 */}
        <section>
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">승인됨</h2>
          {approved.length === 0 ? (
            <p className="text-gray-600 text-sm">승인된 사연이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {approved.map(s => (
                <SongCard
                  key={s.id}
                  song={s}
                  approved
                  onDelete={() => deleteLifeSong(s.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function SongCard({
  song,
  approved = false,
  onApprove,
  onDelete,
}: {
  song: Song
  approved?: boolean
  onApprove?: () => void
  onDelete?: () => void
}) {
  return (
    <div className={`border rounded-xl p-5 ${approved ? "border-green-900/50 bg-green-950/20" : "border-white/10 bg-gray-800/50"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{song.songTitle}</p>
          <p className="text-orange-400 text-xs mt-0.5">{song.artist} · by {song.name}</p>
          {song.youtubeUrl && (
            <a
              href={song.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline mt-1 inline-block"
            >
              YouTube ↗
            </a>
          )}
        </div>
        <p className="text-xs text-gray-600 shrink-0">
          {new Date(song.createdAt).toLocaleDateString("ko-KR")}
        </p>
      </div>
      <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-3">{song.story}</p>
      <div className="flex gap-2 mt-4">
        {!approved && onApprove && (
          <button
            onClick={onApprove}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition"
          >
            승인
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-4 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-300 text-xs rounded-lg transition"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
