"use client"

import {useEffect, useMemo, useRef, useState} from "react"
// ✅ 마니님 Firebase 클라이언트 그대로 사용
import {database, storage} from "../../../api/firebase"
import {
  ref as dbRef,
  onValue,
  off,
  set,
  remove,
  serverTimestamp
} from "firebase/database"
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage"

type Item = {
  id: string // Grok post UUID
  title: string
  thumbUrl?: string // Firebase Storage 다운로드 URL
  imagePath?: string // Firebase Storage 경로 (삭제/교체용)
  createdAt?: number
}

const ROOT = "posex_items"

const extractGrokId = (input: string): string | null => {
  if (!input) return null
  const t = input.trim()
  const uuid =
    t.match(
      /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})/
    )?.[1] ?? null
  if (uuid) return uuid
  const m = t.match(/grok\.com\/imagine\/post\/([0-9a-fA-F-]{36})/)
  if (m) return m[1]
  return null
}

const grokUrl = (id: string) => `https://grok.com/imagine/post/${id}`

export default function PoseXListPage() {
  const [itemsMap, setItemsMap] = useState<Record<string, Item>>({})
  const [title, setTitle] = useState("")
  const [grokInput, setGrokInput] = useState("")

  // 드롭된 파일 상태 & 미리보기
  const [droppedFile, setDroppedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<number>(0) // 업로드 진행률 (0~100)

  // RTDB 실시간 구독
  useEffect(() => {
    const r = dbRef(database, ROOT)
    const listener = (snap: any) => {
      const val = snap.val() || {}
      setItemsMap(val)
      setLoading(false)
    }
    const err = (e: unknown) => {
      console.error(e)
      setError("데이터를 불러오는 중 오류가 발생했습니다.")
      setLoading(false)
    }
    onValue(r, listener, err)
    return () => off(r, "value", listener)
  }, [])

  // 최신순 정렬
  const items = useMemo(() => {
    const arr: Item[] = Object.values(itemsMap || {})
    return arr.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }, [itemsMap])

  // 드래그&드롭 핸들러
  const onDropAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const onDropAreaDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setError(null)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 첨부할 수 있어요.")
      return
    }
    setDroppedFile(file)
    // 로컬 미리보기
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  // 파일 인풋(드롭이 어려운 환경 대비)
  const onPickFile = (file?: File) => {
    setError(null)
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 첨부할 수 있어요.")
      return
    }
    setDroppedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  // Storage 업로드 → downloadURL 반환
  const uploadToStorage = (file: File, id: string) =>
    new Promise<{downloadURL: string; imagePath: string}>((resolve, reject) => {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_")
      const imagePath = `posex/${id}/${Date.now()}_${safeName}` // 버저닝 경로
      const sRef = storageRef(storage, imagePath)
      const task = uploadBytesResumable(sRef, file, {contentType: file.type})

      task.on(
        "state_changed",
        snap => {
          const pct = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          )
          setProgress(pct)
        },
        err => reject(err),
        async () => {
          const downloadURL = await getDownloadURL(task.snapshot.ref)
          resolve({downloadURL, imagePath})
        }
      )
    })

  // 저장
  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setProgress(0)

    const id = extractGrokId(grokInput)
    if (!id) {
      setError("유효한 Grok 링크(또는 UUID)를 입력하세요.")
      return
    }

    try {
      let payload: Item = {
        id,
        title: title.trim() || "Untitled"
      }

      if (droppedFile) {
        const {downloadURL, imagePath} = await uploadToStorage(droppedFile, id)
        payload = {...payload, thumbUrl: downloadURL, imagePath}
      }

      await set(dbRef(database, `${ROOT}/${id}`), {
        ...payload,
        createdAt: serverTimestamp()
      })

      // 폼 리셋
      setTitle("")
      setGrokInput("")
      setDroppedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      setProgress(0)
    } catch (e) {
      console.error(e)
      setError("저장 중 오류가 발생했습니다.")
    }
  }

  const removeItem = async (id: string) => {
    setError(null)
    try {
      await remove(dbRef(database, `${ROOT}/${id}`))
      // 참고: Storage 파일 삭제까지 원하면 imagePath를 보고 deleteObject 호출 필요
      // (imagePath를 RTDB에 저장해두었으니 후속으로 추가 가능)
    } catch (e) {
      console.error(e)
      setError("삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <main className="w-full mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">Pose X List</h1>

      {/* 입력 폼 */}
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

        {/* 드래그&드롭 영역 + 파일 인풋 폴백 */}
        <div
          onDragOver={onDropAreaDragOver}
          onDrop={onDropAreaDrop}
          className="mt-1 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-sm text-gray-300 hover:bg-white/5"
        >
          <span className="font-medium">
            이미지 파일을 여기로 드래그해 첨부 (옵션)
          </span>
          <span className="text-xs text-gray-400">또는</span>
          <label className="cursor-pointer rounded bg-white/10 px-3 py-1 text-xs">
            파일 선택
            <input
              type="file"
              accept="image/*"
              onChange={e => onPickFile(e.target.files?.[0] ?? undefined)}
              className="hidden"
            />
          </label>

          {/* 미리보기 & 진행률 */}
          {previewUrl && (
            <div className="mt-3 w-40 overflow-hidden rounded border">
              <img
                src={previewUrl}
                alt="preview"
                className="block w-full object-cover"
              />
            </div>
          )}
          {droppedFile && (
            <p className="text-xs text-gray-400">
              {droppedFile.name} {progress > 0 ? `· 업로드 ${progress}%` : ""}
            </p>
          )}
        </div>

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
      {loading ? (
        <p className="text-sm text-gray-400">불러오는 중…</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(v => (
            <Card key={v.id} item={v} onDelete={() => removeItem(v.id)} />
          ))}
        </ul>
      )}
    </main>
  )
}

// 카드: 썸네일 있으면 이미지, 없으면 Grok iframe
function Card({item, onDelete}: {item: Item; onDelete: () => void}) {
  const [failed, setFailed] = useState(false)
  const [inView, setInView] = useState(false)
  const refEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = refEl.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      {rootMargin: "200px", threshold: 0.01}
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const hasThumb = !!item.thumbUrl

  return (
    <li className="overflow-hidden rounded-xl border bg-white/5 shadow hover:shadow-lg transition">
      <div ref={refEl} className="relative w-full aspect-video bg-black/10">
        {hasThumb ? (
          <img
            src={item.thumbUrl}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : inView && !failed ? (
          <iframe
            key={item.id}
            src={grokUrl(item.id)}
            title={item.title || item.id}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            {failed ? "로드 실패" : "로딩 대기 중…"}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3">
        <span className="font-medium truncate" title={item.title}>
          {item.title}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={grokUrl(item.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            title="Grok에서 열기"
          >
            Open
          </a>
          <button
            onClick={onDelete}
            className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
            title="삭제"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}
