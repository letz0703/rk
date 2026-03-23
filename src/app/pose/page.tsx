// app/pose/page.tsx
"use client"

import { useEffect, useState } from "react"
import { ref, get, push, remove } from "firebase/database"
import { database } from "../../api/firebase"
import { useAuthContext } from "@/components/context/AuthContext"
import LoginButton from "../components/LoginButton"

type Item = {
  firebaseKey: string
  id: string
  title: string
  thumbUrl: string // Cloudinary or external URL (no more base64)
}

export default function PoseHome() {
  const { isAdmin } = useAuthContext()
  const [items, setItems] = useState<Item[]>([])
  const [shareUrl, setShareUrl] = useState("")
  const [title, setTitle] = useState("")
  const [thumbUrl, setThumbUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchItems = async () => {
    const snapshot = await get(ref(database, "pose"))
    if (snapshot.exists()) {
      const data = Object.entries(snapshot.val() as Record<string, Omit<Item, "firebaseKey">>).map(
        ([key, value]) => ({ firebaseKey: key, ...value })
      )
      setItems(data.reverse())
    } else {
      setItems([])
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const extractDriveId = (url: string): string | null => {
    if (!url) return null
    let m = url.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})/)
    if (m) return m[1]
    m = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/)
    if (m) return m[1]
    if (/^[a-zA-Z0-9_-]{10,}$/.test(url)) return url
    return null
  }

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const id = extractDriveId(shareUrl.trim())
    if (!id) {
      setError("유효한 구글 드라이브 공유 주소(또는 파일 ID)를 입력하세요.")
      return
    }
    if (!thumbUrl.trim()) {
      setError("썸네일 이미지 URL을 입력하세요.")
      return
    }
    setLoading(true)
    await push(ref(database, "pose"), {
      id,
      title: title.trim() || "Untitled",
      thumbUrl: thumbUrl.trim(),
    })
    await fetchItems()
    setShareUrl("")
    setTitle("")
    setThumbUrl("")
    setLoading(false)
  }

  const onRemove = async (firebaseKey: string) => {
    await remove(ref(database, `pose/${firebaseKey}`))
    setItems(prev => prev.filter(x => x.firebaseKey !== firebaseKey))
  }

  const drivePreviewUrl = (id: string) =>
    `https://drive.google.com/file/d/${id}/preview`

  return (
    <main className="mx-auto max-w-5xl p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pose · Gallery</h1>
        <LoginButton />
      </div>

      {/* 관리자만 폼 노출 */}
      {isAdmin && (
        <form
          onSubmit={onAdd}
          className="mb-8 grid gap-3 rounded-xl border border-white/10 p-4 bg-white/5"
        >
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Admin · Add Item</p>

          <label className="grid gap-1">
            <span className="text-sm text-gray-300">제목 (옵션)</span>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예) Teaser #1"
              className="rounded border border-white/10 bg-transparent px-3 py-2 text-white"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-300">구글 드라이브 공유 주소 또는 파일 ID</span>
            <input
              value={shareUrl}
              onChange={e => setShareUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/{FILE_ID}/view"
              className="rounded border border-white/10 bg-transparent px-3 py-2 text-white"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-300">썸네일 이미지 URL (Cloudinary 등)</span>
            <input
              value={thumbUrl}
              onChange={e => setThumbUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="rounded border border-white/10 bg-transparent px-3 py-2 text-white"
            />
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "추가 중..." : "추가하기"}
          </button>
        </form>
      )}

      {/* 갤러리 */}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(v => (
          <li
            key={v.firebaseKey}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow"
          >
            <a
              href={drivePreviewUrl(v.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative w-full aspect-[2/3] bg-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbUrl}
                  alt={v.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="font-medium text-sm">{v.title}</span>
                <span className="text-blue-400 text-xs group-hover:underline">Open</span>
              </div>
            </a>
            {isAdmin && (
              <div className="border-t border-white/10 px-3 py-2">
                <button
                  onClick={() => onRemove(v.firebaseKey)}
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-gray-500 text-center py-20">No items yet.</p>
      )}
    </main>
  )
}
