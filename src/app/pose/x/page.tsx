"use client"

import {useEffect, useState} from "react"

type Item = {
  id: string // Grok post UUID
  title: string
  thumbDataUrl: string // base64 data URL or public path (/posex/{id}.jpg)
}

const LS_KEY = "posex_items"

// 초기 시드(기존 하드코딩 아이템을 첫 진입시 1회만 넣어줌)
const SEED: Item[] = [
  {
    id: "442995b8-50a6-4838-86d6-f4185e80c750",
    title: "Pose #1",
    thumbDataUrl: "/posex/442995b8-50a6-4838-86d6-f4185e80c750.jpg"
  }
]

// Grok 링크 또는 UUID에서 post id 추출
const extractGrokId = (input: string): string | null => {
  if (!input) return null
  const trimmed = input.trim()
  // UUID v4-ish
  const uuid =
    trimmed.match(
      /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})/
    )?.[1] ?? null
  if (uuid) return uuid

  // https://grok.com/imagine/post/{uuid}[?...]
  const m = trimmed.match(/grok\.com\/imagine\/post\/([0-9a-fA-F-]{36})/)
  if (m) return m[1]

  return null
}

export default function PoseXListPage() {
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState("")
  const [grokInput, setGrokInput] = useState("") // Grok 링크 또는 UUID
  const [thumbDataUrl, setThumbDataUrl] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  // 1) 최초 로드: localStorage → 없으면 시드 주입
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        setItems(JSON.parse(raw))
      } else {
        setItems(SEED)
        localStorage.setItem(LS_KEY, JSON.stringify(SEED))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // 2) 저장 헬퍼
  const persist = (next: Item[]) => {
    setItems(next)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  }

  // 3) 이미지 파일 → dataURL
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

  // 4) 등록
  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const id = extractGrokId(grokInput)
    if (!id) {
      setError("유효한 Grok 링크(또는 UUID)를 입력하세요.")
      return
    }
    if (!thumbDataUrl) {
      setError("썸네일 이미지를 첨부하세요.")
      return
    }

    const next: Item[] = [
      {
        id,
        title: title.trim() || "Untitled",
        thumbDataUrl
      },
      ...items.filter(x => x.id !== id) // 동일 id 중복 방지(덮어쓰기 느낌)
    ]
    persist(next)

    // reset
    setTitle("")
    setGrokInput("")
    setThumbDataUrl("")
  }

  const removeItem = (id: string) => {
    const next = items.filter(x => x.id !== id)
    persist(next)
  }

  const grokUrl = (id: string) => `https://grok.com/imagine/post/${id}`

  return (
    <main className="w-full mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">Pose X List</h1>

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
            placeholder="예) Pose #3"
            className="rounded border bg-transparent px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-300">
            Grok 링크 또는 포스트 UUID
          </span>
          <input
            value={grokInput}
            onChange={e => setGrokInput(e.target.value)}
            placeholder="https://grok.com/imagine/post/{UUID} 또는 {UUID}"
            className="rounded border bg-transparent px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-300">썸네일 (이미지 파일)</span>
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
              {/* dataURL이므로 next/image 대신 img 사용 */}
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
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-">
        {items.map(v => (
          <li
            key={v.id}
            className="overflow-hidden rounded-xl border bg-white/5 shadow hover:shadow-lg transition"
          >
            <a
              href={grokUrl(v.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
              title="Grok에서 열기"
            >
              <div className="relative w-full aspect-[2/3] bg-black/10">
                {/* thumbDataUrl이 dataURL이거나 /posex/*.jpg일 수 있으므로 img 사용 */}
                <img
                  src={v.thumbDataUrl}
                  alt={v.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="font-medium">{v.title}</span>
                <span className="text-blue-600 group-hover:underline">
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
