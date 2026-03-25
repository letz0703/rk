"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { models, type Model, type GalleryItem } from "./data"

const flagMap = { KR: "🇰🇷", US: "🇺🇸" }
const labelMap = { KR: "한국 여성", US: "미국 여성" }

type EditState = {
  id: string | null
  thumbnail: string
  deviantartUrl: string
  easelUrl: string
  memo: string
}
const EMPTY_EDIT: EditState = { id: null, thumbnail: "", deviantartUrl: "", easelUrl: "", memo: "" }

export default function ModelPageContent({ model, isAdmin }: { model: Model; isAdmin: boolean }) {
  const slug = model.slug
  const others = models.filter(m => m.slug !== slug)

  // ── 라이브 데이터 (API에서 최신값 로드) ──────────────────────
  const [bio, setBio] = useState(model.bio)
  const [deviantArtUrl, setDeviantArtUrl] = useState(model.deviantArtUrl)
  const [profileImage, setProfileImage] = useState(model.profileImage)
  const [gallery, setGallery] = useState<GalleryItem[]>(model.gallery)

  useEffect(() => {
    fetch(`/api/model-meta?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (!data) return
        setBio(data.bio ?? model.bio)
        setDeviantArtUrl(data.deviantArtUrl ?? model.deviantArtUrl)
        setGallery(data.gallery ?? [])
      })
    fetch(`/api/model-images?slug=${slug}`)
      .then(r => r.json())
      .then(data => { if (data.profileImage) setProfileImage(data.profileImage) })
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 소개글 편집 ──────────────────────────────────────────────
  const [editingBio, setEditingBio] = useState(false)
  const [bioInput, setBioInput] = useState(bio)
  const [daInput, setDaInput] = useState(deviantArtUrl)
  const [bioSaving, setBioSaving] = useState(false)

  const handleSaveBio = async () => {
    setBioSaving(true)
    await fetch("/api/model-meta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "update-meta", bio: bioInput, deviantArtUrl: daInput }),
    })
    setBio(bioInput)
    setDeviantArtUrl(daInput)
    setEditingBio(false)
    setBioSaving(false)
  }

  // ── 프로필 이미지 업로드 ─────────────────────────────────────
  const [profileUploading, setProfileUploading] = useState(false)
  const profileRef = useRef<HTMLInputElement>(null)

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileUploading(true)
    const form = new FormData()
    form.append("slug", slug); form.append("type", "profile"); form.append("file", file)
    const res = await fetch("/api/model-images", { method: "POST", body: form })
    const data = await res.json()
    if (data.url) setProfileImage(data.url)
    setProfileUploading(false)
    e.target.value = ""
  }

  // ── 갤러리 아이템 편집 ───────────────────────────────────────
  const [editItem, setEditItem] = useState<EditState | null>(null)
  const [thumbUploading, setThumbUploading] = useState(false)
  const [itemSaving, setItemSaving] = useState(false)
  const thumbRef = useRef<HTMLInputElement>(null)

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbUploading(true)
    const form = new FormData()
    form.append("slug", slug); form.append("type", "gallery"); form.append("file", file)
    const res = await fetch("/api/model-images", { method: "POST", body: form })
    const data = await res.json()
    if (data.url) {
      setEditItem(s => s ? { ...s, thumbnail: data.url } : s)
    } else {
      console.error("[thumb upload error]", data)
      alert(`썸네일 업로드 실패: ${data.error ?? JSON.stringify(data)}`)
    }
    setThumbUploading(false)
    e.target.value = ""
  }

  const handleSaveItem = async () => {
    if (!editItem?.thumbnail) return
    setItemSaving(true)
    const { id, thumbnail, deviantartUrl, easelUrl, memo } = editItem
    if (id) {
      setGallery(g => g.map(item => item.id === id ? { ...item, thumbnail, deviantartUrl, easelUrl, memo } : item))
    } else {
      const newItem: GalleryItem = { id: crypto.randomUUID(), thumbnail, deviantartUrl, easelUrl, memo }
      setGallery(g => [...g, newItem])
    }
    setEditItem(null)
    setItemSaving(false)
    fetch("/api/model-meta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        id
          ? { slug, action: "update-gallery-item", id, updates: { thumbnail, deviantartUrl, easelUrl, memo } }
          : { slug, action: "add-gallery-item", item: { thumbnail, deviantartUrl, easelUrl, memo } }
      ),
    })
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("삭제할까요?")) return
    await fetch("/api/model-meta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "delete-gallery-item", id }),
    })
    setGallery(g => g.filter(item => item.id !== id))
  }

  // ── 렌더 ────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/models" className="text-sm text-gray-500 hover:text-gray-300 mb-10 inline-block">
          ← Models
        </Link>

        {/* 프로필 섹션 */}
        <div className="flex flex-col sm:flex-row gap-8 mb-14">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0 w-full sm:w-56">
            <div className="relative group w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImage} alt={model.name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/5 to-white/10">
                  <span className="text-6xl opacity-20">👤</span>
                </div>
              )}
              {/* 어드민: 호버 시 업로드 버튼 */}
              {isAdmin && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => profileRef.current?.click()}
                    disabled={profileUploading}
                    className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs hover:bg-white/30 disabled:opacity-50"
                  >
                    {profileUploading ? "업로드 중..." : "사진 변경"}
                  </button>
                </div>
              )}
            </div>
            {isAdmin && (
              <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
            )}
          </div>

          {/* 모델 정보 */}
          <div className="flex flex-col justify-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold">{model.nameKo}</h1>
              <p className="text-gray-400 text-lg mt-1">{model.name}</p>
            </div>
            <p className="text-xs text-gray-500">
              {flagMap[model.nationality]} {labelMap[model.nationality]}
            </p>

            {/* 소개글 */}
            {editingBio ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  rows={4}
                  className="w-full max-w-md rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-white/40"
                />
                <input
                  value={daInput}
                  onChange={e => setDaInput(e.target.value)}
                  placeholder="DeviantArt URL"
                  className="w-full max-w-md rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleSaveBio}
                    disabled={bioSaving}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-sm hover:bg-blue-500 disabled:opacity-50 transition"
                  >
                    {bioSaving ? "저장 중..." : "저장"}
                  </button>
                  <button
                    onClick={() => { setEditingBio(false); setBioInput(bio); setDaInput(deviantArtUrl) }}
                    className="px-4 py-1.5 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">{bio}</p>
                {isAdmin && (
                  <button
                    onClick={() => { setBioInput(bio); setDaInput(deviantArtUrl); setEditingBio(true) }}
                    className="self-start text-xs text-gray-500 hover:text-gray-300 border border-white/10 px-2 py-1 rounded transition"
                  >
                    편집
                  </button>
                )}
              </div>
            )}

            {/* DeviantArt 버튼 */}
            {!editingBio && deviantArtUrl && (
              <a
                href={deviantArtUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#05CC47] text-black font-bold text-sm hover:brightness-110 transition w-fit"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M15 0H9l-2.5 5H8l-7 11h6l2.5-5H8L15 0z" />
                </svg>
                DeviantArt에서 보기
              </a>
            )}
          </div>
        </div>

        {/* 갤러리 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Gallery</h2>
            {isAdmin && !editItem && (
              <button
                onClick={() => setEditItem({ ...EMPTY_EDIT })}
                className="text-xs border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
              >
                + 추가
              </button>
            )}
          </div>

          {/* 갤러리 그리드 */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {gallery.map(item => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <a
                    href={item.deviantartUrl || undefined}
                    target={item.deviantartUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`block relative aspect-[3/4] ${item.deviantartUrl ? "cursor-pointer" : "cursor-default"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={`${model.name} gallery`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                  </a>
                  {item.easelUrl && (
                    <a
                      href={item.easelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-medium hover:bg-black/80 transition backdrop-blur-sm"
                    >
                      Arc Gallery ↗
                    </a>
                  )}
                  {/* 어드민 편집/삭제 */}
                  {isAdmin && (
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setEditItem({ id: item.id, thumbnail: item.thumbnail, deviantartUrl: item.deviantartUrl, easelUrl: item.easelUrl, memo: item.memo })}
                        className="w-6 h-6 rounded bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-black/80"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="w-6 h-6 rounded bg-red-600/80 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {gallery.length === 0 && !editItem && (
            <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
              <p className="text-gray-600 text-sm">이미지 준비 중입니다.</p>
            </div>
          )}

          {/* 어드민 추가/편집 폼 */}
          {isAdmin && editItem && (
            <div className="rounded-xl border border-white/15 bg-white/5 p-5 space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {editItem.id ? "아이템 편집" : "새 아이템"}
              </p>

              {/* 썸네일 */}
              <div className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0">
                  <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    {editItem.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editItem.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl opacity-20">🖼</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />
                  <button
                    onClick={() => thumbRef.current?.click()}
                    disabled={thumbUploading}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-xs hover:bg-white/10 disabled:opacity-50 transition"
                  >
                    {thumbUploading ? "업로드 중..." : editItem.thumbnail ? "썸네일 교체" : "썸네일 업로드"}
                  </button>
                </div>
              </div>

              <label className="block">
                <span className="text-xs text-gray-400 mb-1 block">DeviantArt URL</span>
                <input
                  value={editItem.deviantartUrl}
                  onChange={e => setEditItem(s => s ? { ...s, deviantartUrl: e.target.value } : s)}
                  placeholder="https://www.deviantart.com/..."
                  className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400 mb-1 block">Arc Gallery URL</span>
                <input
                  value={editItem.easelUrl}
                  onChange={e => setEditItem(s => s ? { ...s, easelUrl: e.target.value } : s)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400 mb-1 block">메모</span>
                <textarea
                  value={editItem.memo}
                  onChange={e => setEditItem(s => s ? { ...s, memo: e.target.value } : s)}
                  rows={3}
                  placeholder="프롬프트, 작업 노트 등"
                  className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-white/30"
                />
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveItem}
                  disabled={itemSaving || !editItem.thumbnail}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-sm hover:bg-blue-500 disabled:opacity-40 transition"
                >
                  {itemSaving ? "저장 중..." : "저장"}
                </button>
                <button
                  onClick={() => setEditItem(null)}
                  className="px-5 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Other Models */}
        <div className="pt-10 border-t border-white/10">
          <h2 className="text-xl font-bold mb-6">Other Models</h2>
          <div className="flex gap-4">
            {others.map(other => (
              <Link key={other.slug} href={`/${other.slug}`}
                className="group flex flex-col items-center gap-2 w-28">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  {other.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={other.profileImage} alt={other.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/5 to-white/10">
                      <span className="text-3xl opacity-20">👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  {other.nameKo}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
