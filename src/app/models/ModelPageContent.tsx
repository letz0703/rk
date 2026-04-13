"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { models, type Model, type GalleryItem } from "./data"
import { database } from "@/api/firebase"
import { ref, set } from "firebase/database"

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
  const [dragOver, setDragOver] = useState(false)
  const [dropUploading, setDropUploading] = useState(false)

  const uploadFileToGallery = async (file: File) => {
    const form = new FormData()
    form.append("slug", slug); form.append("type", "gallery"); form.append("file", file)
    const res = await fetch("/api/model-images", { method: "POST", body: form })
    const data = await res.json()
    if (!data.url) { alert(`업로드 실패: ${data.error ?? "unknown"}`); return }
    const newItem: GalleryItem = { id: crypto.randomUUID(), thumbnail: data.url, deviantartUrl: "", easelUrl: "", memo: "" }
    setGallery(g => [...g, newItem])
    fetch("/api/model-meta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action: "add-gallery-item", item: { thumbnail: data.url, deviantartUrl: "", easelUrl: "", memo: "" } }),
    })
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (!isAdmin) return
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
    if (!files.length) return
    setDropUploading(true)
    for (const file of files) await uploadFileToGallery(file)
    setDropUploading(false)
  }

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
    <main className="min-h-screen bg-white text-[#c10002] px-6 py-20 selection:bg-[#c10002]/10 selection:text-[#c10002]">
      <div className="max-w-6xl mx-auto">
        <Link href="/models" className="group flex items-center gap-1 text-sm text-slate-400 hover:text-[#c10002] mb-12 transition-all font-medium">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Models
        </Link>

        {/* 프로필 섹션 */}
        <div className="flex flex-col md:flex-row gap-12 mb-20">
          {/* 프로필 이미지 (Premium Card Style) */}
          <div className="flex-shrink-0 w-full md:w-72">
            <div className="relative group w-full aspect-[3/4] rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-slate-50">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImage} alt={model.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                  <span className="text-7xl opacity-10">👤</span>
                </div>
              )}
              {/* 어드민: 호버 시 업로드 버튼 */}
              {isAdmin && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300">
                  <button
                    onClick={() => profileRef.current?.click()}
                    disabled={profileUploading}
                    className="px-6 py-2 rounded-full bg-[#c10002] text-white text-xs font-bold hover:brightness-125 transition shadow-lg"
                  >
                    {profileUploading ? "UPLOAD..." : "CHANGE PHOTO"}
                  </button>
                </div>
              )}
            </div>
            {isAdmin && (
              <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
            )}
          </div>

          {/* 모델 정보 */}
          <div className="flex flex-col justify-center flex-1">
            <div className="mb-6">
              <span className="px-3 py-1 bg-[#c10002]/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#c10002] border border-[#c10002]/10 mb-4 inline-block">
                {flagMap[model.nationality]} {labelMap[model.nationality]}
              </span>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-2">{model.nameKo}</h1>
              <p className="text-slate-300 text-2xl font-bold uppercase tracking-tight">{model.name}</p>
            </div>

            {/* 소개글 */}
            {editingBio ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#c10002]/50 transition-colors"
                />
                <input
                  value={daInput}
                  onChange={e => setDaInput(e.target.value)}
                  placeholder="DeviantArt URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#c10002]/50 transition-colors"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBio}
                    disabled={bioSaving}
                    className="px-6 py-2 rounded-full bg-[#c10002] text-white text-sm font-bold hover:brightness-125 disabled:opacity-50 transition"
                  >
                    {bioSaving ? "SAVING..." : "SAVE"}
                  </button>
                  <button
                    onClick={() => { setEditingBio(false); setBioInput(bio); setDaInput(deviantArtUrl) }}
                    className="px-6 py-2 rounded-full border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <p className="text-slate-600 text-lg leading-relaxed font-medium max-w-xl">{bio}</p>
                <div className="flex items-center gap-4">
                  {deviantArtUrl && (
                    <a
                      href={deviantArtUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-full bg-[#c10002] text-white font-black text-sm hover:brightness-110 transition-all shadow-xl shadow-[#c10002]/20 uppercase tracking-widest box-border"
                    >
                      DeviantArt ↗
                    </a>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { setBioInput(bio); setDaInput(deviantArtUrl); setEditingBio(true) }}
                      className="p-3 rounded-full border border-slate-200 text-slate-400 hover:text-[#c10002] hover:border-[#c10002]/30 transition"
                      title="Edit Bio"
                    >
                      ✎
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 갤러리 섹션 */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-3xl font-black italic uppercase italic tracking-tight mb-2">Portfolio</h2>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Selected Works & Membership Content</p>
            </div>
            {isAdmin && !editItem && (
              <button
                onClick={() => setEditItem({ ...EMPTY_EDIT })}
                className="px-6 py-2 rounded-full border-2 border-[#c10002] text-[#c10002] text-xs font-black uppercase tracking-widest hover:bg-[#c10002] hover:text-white transition-all"
              >
                + ADD ITEM
              </button>
            )}
          </div>

          {/* 갤러리 그리드 (Public) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {gallery.map(item => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.easelUrl && (
                    <div className="absolute bottom-3 left-3 right-3 text-[10px] font-black uppercase text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                      <span>Arc Gallery</span>
                      <span>↗</span>
                    </div>
                  )}
                </a>
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setEditItem({ id: item.id, thumbnail: item.thumbnail, deviantartUrl: item.deviantartUrl, easelUrl: item.easelUrl, memo: item.memo })}
                      className="w-8 h-8 rounded-full bg-white text-[#c10002] text-xs flex items-center justify-center shadow-lg hover:bg-[#c10002] hover:text-white transition"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="w-8 h-8 rounded-full bg-white text-red-500 text-xs flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* NSFW / Membership Card */}
            {model.nsfwUrl && (
              <div className="group relative rounded-2xl overflow-hidden border-2 border-dashed border-[#c10002]/20 bg-slate-50 flex flex-col items-center justify-center p-6 text-center transition-all hover:border-[#c10002]/50 hover:bg-[#c10002]/5 aspect-[3/4]">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 rounded-full bg-[#c10002]/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <span className="text-4xl">🔞</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#c10002] rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-[10px] text-white">🔒</span>
                  </div>
                </div>
                <h3 className="text-xl font-black italic uppercase italic leading-tight mb-2">NSFW Gallery</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 leading-relaxed">
                  Support the model on external platforms to view the full uncensored collection.
                </p>
                <a
                  href={model.nsfwUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#c10002] text-white text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all shadow-lg active:scale-95"
                >
                  Unlock Access ↗
                </a>
              </div>
            )}
          </div>

          {/* 갤러리 비어있음 + 어드민 에디터 폼 (기존 로직 유지하되 스타일링만 입힘) */}
          {isAdmin && editItem && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 space-y-6 shadow-inner">
              <p className="text-sm font-black text-[#c10002] uppercase tracking-[0.2em] mb-4">
                {editItem.id ? "EDIT ITEM" : "NEW PORTFOLIO ITEM"}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] max-w-[200px] rounded-2xl overflow-hidden border-2 border-slate-200 bg-white">
                    {editItem.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editItem.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl opacity-10">🖼</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => thumbRef.current?.click()}
                    disabled={thumbUploading}
                    className="w-full max-w-[200px] py-2 rounded-xl border border-slate-200 text-[10px] font-black tracking-widest uppercase hover:bg-white transition disabled:opacity-50"
                  >
                    {thumbUploading ? "UPLOADING..." : "SELECT IMAGE"}
                  </button>
                  <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />
                </div>
                
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">DeviantArt Connection</span>
                    <input
                      value={editItem.deviantartUrl}
                      onChange={e => setEditItem(s => s ? { ...s, deviantartUrl: e.target.value } : s)}
                      placeholder="https://www.deviantart.com/..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#c10002]/30"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Arc Gallery Link</span>
                    <input
                      value={editItem.easelUrl}
                      onChange={e => setEditItem(s => s ? { ...s, easelUrl: e.target.value } : s)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#c10002]/30"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Internal Note</span>
                    <textarea
                      value={editItem.memo}
                      onChange={e => setEditItem(s => s ? { ...s, memo: e.target.value } : s)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-[#c10002]/30"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveItem}
                  disabled={itemSaving || !editItem.thumbnail}
                  className="px-8 py-3 rounded-full bg-[#c10002] text-white text-xs font-black uppercase tracking-widest hover:brightness-125 transition"
                >
                  {itemSaving ? "SAVING..." : "SAVE ITEM"}
                </button>
                <button
                  onClick={() => setEditItem(null)}
                  className="px-8 py-3 rounded-full border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 어드민: 멤버 비밀번호 변경 */}
        {isAdmin && <MemberPasswordAdmin />}

        {/* Other Models (Circular Icons Style) */}
        <div className="pt-16 border-t border-slate-100 mb-20">
          <h2 className="text-sm font-black italic uppercase italic tracking-[0.3em] text-[#c10002] mb-10 text-center">Meet More rainskiss Models</h2>
          <div className="flex justify-center flex-wrap gap-8 md:gap-16">
            {others.map(other => (
              <Link key={other.slug} href={`/${other.slug}`}
                className="group flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-slate-100 p-1 group-hover:border-[#c10002] transition-colors duration-500 shadow-lg">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {other.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={other.profileImage} alt={other.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                        <span className="text-4xl opacity-10">👤</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black italic uppercase italic tracking-tight group-hover:text-[#c10002] transition-colors">{other.nameKo}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{other.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function MemberPasswordAdmin() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const handleSave = async () => {
    if (!input.trim()) return
    setSaving(true)
    setMsg("")
    try {
      await set(ref(database, "config/memberPassword"), input.trim())
      setMsg("SUCCESS")
      setInput("")
      setTimeout(() => { setMsg(""); setOpen(false) }, 1500)
    } catch {
      setMsg("ERROR")
    }
    setSaving(false)
  }

  return (
    <div className="my-12 p-8 rounded-3xl border border-slate-100 bg-slate-50/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black mb-1">Security Control</p>
          <p className="text-sm font-bold text-[#c10002] uppercase tracking-tight italic">Member Password Management</p>
        </div>
        <button
          onClick={() => { setOpen(o => !o); setMsg(""); setInput("") }}
          className="px-4 py-2 rounded-full border border-[#c10002]/20 text-[#c10002] text-[10px] font-black uppercase tracking-widest hover:bg-[#c10002]/5 transition"
        >
          {open ? "CLOSE" : "ACCESS CONTROL"}
        </button>
      </div>
      {open && (
        <div className="mt-6 flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="NEW PASSWORD"
            className="flex-1 max-w-xs rounded-full border border-slate-200 bg-white px-6 py-3 text-xs focus:outline-none focus:border-[#c10002]/30"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={saving || !input.trim()}
            className="px-8 py-3 rounded-full bg-[#c10002] text-white text-[10px] font-black uppercase tracking-widest hover:brightness-125 disabled:opacity-40 transition-all shadow-lg"
          >
            {saving ? "SAVING..." : "UPDATE"}
          </button>
          {msg && <span className={`text-[10px] font-black tracking-widest ${msg === "ERROR" ? "text-red-500" : "text-green-500"}`}>{msg}</span>}
        </div>
      )}
    </div>
  )
}

