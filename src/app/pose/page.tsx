// app/pose/page.tsx
"use client"

import {useEffect, useState} from "react"

import LoginButton from "../components/LoginButton"

type Item = {
  id: string
  title: string
  thumbDataUrl: string // base64 data url
}

const LS_KEY = "pose_drive_videos"

export default function PoseHome() {
  const [items, setItems] = useState<Item[]>([])
  const [shareUrl, setShareUrl] = useState("")
  const [title, setTitle] = useState("")
  const [thumbDataUrl, setThumbDataUrl] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  // 1) 최초 로드: localStorage에서 불러오기
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      console.error(e)
    }
  }, [])

  // 2) 저장 헬퍼
  const persist = (next: Item[]) => {
    setItems(next)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  }

  // 3) Drive 공유 링크에서 파일 ID 추출
  const extractDriveId = (url: string): string | null => {
    if (!url) return null
    // /file/d/{id}/view
    let m = url.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})/)
    if (m) return m[1]
    // ?id=...
    m = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/)
    if (m) return m[1]
    // uc?export=preview&id=...
    m = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/)
    if (m) return m[1]
    // 그냥 id만 붙여넣은 경우
    if (/^[a-zA-Z0-9_-]{10,}$/.test(url)) return url
    return null
  }

  // 4) 이미지 파일 → dataURL
  const onPickThumb = async (file?: File) => {
    setError(null)
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드하세요.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setThumbDataUrl(String(reader.result))
    reader.readAsDataURL(file)
  }

  // 5) 등록
  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const id = extractDriveId(shareUrl.trim())
    if (!id) {
      setError("유효한 구글 드라이브 공유 주소(또는 파일 ID)를 입력하세요.")
      return
    }
    if (!thumbDataUrl) {
      setError("썸네일 이미지를 첨부하세요.")
      return
    }
    const item: Item = {
      id,
      title: title.trim() || "Untitled",
      thumbDataUrl
    }
    const next = [item, ...items]
    persist(next)

    // reset
    setShareUrl("")
    setTitle("")
    setThumbDataUrl("")
  }

  const removeItem = (id: string) => {
    const next = items.filter(x => x.id !== id)
    persist(next)
  }

  const drivePreviewUrl = (id: string) =>
    `https://drive.google.com/file/d/${id}/preview` // 안정적 임베드 URL

  return (
    <main className="mx-auto max-w-5xl p-6 w-full">
      <h1 className="mb-6 text-3xl font-bold">Pose • Google Drive 연결</h1>

      <LoginButton />
      {/* 폼 */}
      <form
        onSubmit={onAdd}
        className="mb-8 grid gap-3 rounded-xl border p-4 bg-white/5"
      >
        <label className="grid gap-1">
          <span className="text-sm text-gray-300">제목 (옵션)</span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예) Teaser #1"
            className="rounded border bg-transparent px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-300">
            구글 드라이브 공유 주소 또는 파일 ID
          </span>
          <input
            value={shareUrl}
            onChange={e => setShareUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/{FILE_ID}/view 또는 FILE_ID"
            className="rounded border bg-transparent px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-300">
            썸네일 (로컬 이미지 파일)
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={e => onPickThumb(e.target.files?.[0])}
            className="rounded border bg-transparent file:mr-3 file:rounded file:border file:bg-white/10 file:px-3 file:py-2"
          />
        </label>

        {/* 썸네일 미리보기 */}
        {thumbDataUrl && (
          <div className="mt-2">
            <span className="text-sm text-gray-300">미리보기</span>
            <div className="relative mt-2 w-40 overflow-hidden rounded-lg border">
              <img
                src={thumbDataUrl}
                alt="thumb"
                className="block w-full object-cover"
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="mt-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500"
          >
            추가하기
          </button>
        </div>
      </form>

      {/* 리스트 */}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(v => (
          <li
            key={v.id}
            className="overflow-hidden rounded-xl border bg-white/5 shadow"
          >
            <a
              href={drivePreviewUrl(v.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              title="새 탭에서 열기"
            >
              <div className="relative w-full aspect-[2/3] bg-black/10">
                <img
                  src={v.thumbDataUrl}
                  alt={v.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="font-medium">{v.title}</span>
                <span className="text-blue-500 group-hover:underline">
                  Open
                </span>
              </div>
            </a>
            {/*<div className="flex items-center justify-between border-t px-3 py-2">
              <code className="text-xs text-gray-400 truncate">{v.id}</code>
              <button
                onClick={() => removeItem(v.id)}
                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                title="삭제"
              >
                Delete
              </button>
            </div>*/}
          </li>
        ))}
      </ul>
    </main>
  )
}
