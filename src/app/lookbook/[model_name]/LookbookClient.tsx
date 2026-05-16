"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  onModelData,
  uploadModelFile,
  setModelProfileImage,
  onGalleryEntries,
  addGalleryEntry,
  removeGalleryEntry,
} from "@/api/firebase"
import LookbookGallery from "./LookbookGallery"
import RequestBoard from "./RequestBoard"
import { ArrowLeft, Globe, Trash2, Loader2, Lock, X } from "@/lib/icons"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────

interface ModelMeta {
  slug: string
  name: string
  nameKo: string
  nationality: string
  profileImage: string
  bio: string
  deviantArtUrl: string
  gallery: string[]
}

interface FirebaseModelData {
  profileImage?: string
  bio?: string
  deviantArtUrl?: string
}

export interface GalleryEntry {
  id: string
  imageUrl: string
  linkUrl: string
  addedAt: number
}

interface Props {
  model: ModelMeta
}

// ── Component ──────────────────────────────────────────────────────────────

export default function LookbookClient({ model }: Props) {
  const [fbData, setFbData] = useState<FirebaseModelData | null>(null)
  const [galleryEntries, setGalleryEntries] = useState<GalleryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Admin password state
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [adminPw, setAdminPw] = useState("")
  const [adminPwError, setAdminPwError] = useState("")
  const [isCheckingPw, setIsCheckingPw] = useState(false)

  // Profile upload state
  const [isDraggingProfile, setIsDraggingProfile] = useState(false)
  const [isUploadingProfile, setIsUploadingProfile] = useState(false)
  const profileFileInputRef = useRef<HTMLInputElement>(null)

  // Gallery form state
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [isDraggingGallery, setIsDraggingGallery] = useState(false)
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false)
  const galleryFileInputRef = useRef<HTMLInputElement>(null)

  // 두 Firebase 구독을 하나의 useEffect에서 동시에 시작 → waterfall 제거
  useEffect(() => {
    setIsLoading(true)
    const unsubModel = onModelData(model.slug, (data: FirebaseModelData | null) => {
      setFbData(data)
      setIsLoading(false)
    })
    const unsubGallery = onGalleryEntries(model.slug, (entries: unknown[]) => {
      setGalleryEntries(entries as GalleryEntry[])
    })
    return () => {
      unsubModel()
      unsubGallery()
    }
  }, [model.slug])

  // Merged model data
  const profileImage = fbData?.profileImage || model.profileImage || ""
  const bio = fbData?.bio || model.bio || ""
  const deviantArtUrl =
    fbData?.deviantArtUrl || model.deviantArtUrl || "https://www.deviantart.com/rainskiss-x"

  // ── Admin password helpers ────────────────────────────────────────────────

  /** 어드민 아닐 때 액션 시도 시 모달 열기 */
  function requireAdmin(action: () => void) {
    if (isAdmin) { action(); return }
    setShowAdminModal(true)
    // 모달 닫힌 후 액션을 실행할 방법이 없으므로 사용자가 로그인 후 다시 시도
  }

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!adminPw.trim()) return
    setIsCheckingPw(true)
    setAdminPwError("")
    try {
      const res = await fetch("/api/check-admin-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPw }),
      })
      if (res.ok) {
        setIsAdmin(true)
        setShowAdminModal(false)
        setAdminPw("")
      } else {
        const body = await res.json().catch(() => ({}))
        if (res.status === 401) setAdminPwError("비밀번호가 틀렸습니다.")
        else if (body?.error === "not configured") setAdminPwError("서버에 ADMIN_PASSWORD가 설정되지 않았습니다. .env 확인 후 서버 재시작.")
        else setAdminPwError(`오류 (${res.status}) — 서버를 재시작해 보세요.`)
      }
    } catch {
      setAdminPwError("서버 오류. 다시 시도해주세요.")
    } finally {
      setIsCheckingPw(false)
    }
  }

  // ── Profile handlers ─────────────────────────────────────────────────────

  async function uploadProfileFile(file: File) {
    if (!file.type.startsWith("image/")) return
    setIsUploadingProfile(true)
    try {
      const url = await uploadModelFile(model.slug, "profile", file)
      await setModelProfileImage(model.slug, url)
    } finally {
      setIsUploadingProfile(false)
    }
  }

  function handleProfileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDraggingProfile(false)
    if (!isAdmin) return
    const file = e.dataTransfer.files[0]
    if (file) uploadProfileFile(file)
  }

  // ── Gallery handlers ──────────────────────────────────────────────────────

  async function uploadGalleryFile(file: File) {
    if (!file.type.startsWith("image/")) return
    setIsUploadingGalleryImage(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("slug", model.slug)
      const res = await fetch("/api/upload-gallery-image", { method: "POST", body: form })
      if (!res.ok) throw new Error("upload failed")
      const { url } = await res.json()
      setNewImageUrl(url)
    } finally {
      setIsUploadingGalleryImage(false)
    }
  }

  function handleGalleryDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDraggingGallery(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadGalleryFile(file)
  }

  async function handleAddEntry() {
    if (!newImageUrl.trim() || !isAdmin) return
    setIsAddingEntry(true)
    try {
      await addGalleryEntry(model.slug, newImageUrl.trim(), newLinkUrl.trim())
      setNewImageUrl("")
      setNewLinkUrl("")
    } finally {
      setIsAddingEntry(false)
    }
  }

  async function handleRemoveEntry(id: string) {
    setRemovingId(id)
    try {
      await removeGalleryEntry(model.slug, id)
    } finally {
      setRemovingId(null)
    }
  }

  // 로딩 스켈레톤 — Firebase 응답 전 빈 화면 flash 방지
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <nav className="border-b border-border px-5 py-3 flex items-center justify-between">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-4 w-4 rounded bg-muted animate-pulse" />
        </nav>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">
          <section className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded bg-muted animate-pulse shrink-0" />
            <div className="space-y-3 flex-1 pt-2">
              <div className="h-8 w-48 rounded bg-muted animate-pulse" />
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="h-4 w-full max-w-md rounded bg-muted animate-pulse" />
              <div className="h-4 w-3/4 max-w-md rounded bg-muted animate-pulse" />
            </div>
          </section>
          <div className="border-t border-border" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="border-b border-border px-5 py-3 flex items-center justify-between">
        <Link
          href="/models"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Models
        </Link>

        {/* Admin lock button */}
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary border border-primary/30 px-2 py-0.5 rounded">
              Admin 모드
            </span>
            <button
              onClick={() => setIsAdmin(false)}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              잠금
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdminModal(true)}
            className="text-muted-foreground/40 hover:text-muted-foreground transition-colors p-1"
            title="Admin"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">

        {/* ── Model Hero ────────────────────────────────────────────────── */}
        <section className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
          {/* Profile image — drag-and-drop for admin */}
          <div className="relative shrink-0">
            <div
              className={cn(
                "relative w-28 h-28 sm:w-36 sm:h-36 rounded overflow-hidden border shadow-gold-glow",
                isAdmin
                  ? "cursor-pointer border-dashed border-2 hover:border-primary transition-colors"
                  : "border-border",
                isDraggingProfile && "border-primary bg-primary/5",
                isUploadingProfile && "opacity-60"
              )}
              onDragOver={e => { if (isAdmin) { e.preventDefault(); setIsDraggingProfile(true) }}}
              onDragLeave={() => setIsDraggingProfile(false)}
              onDrop={handleProfileDrop}
              onClick={() => isAdmin && profileFileInputRef.current?.click()}
              title={isAdmin ? "클릭 또는 드래그로 프로필 업로드" : undefined}
            >
              {profileImage ? (
                <Image src={profileImage} alt={model.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-3xl font-headline text-primary/30">{model.name[0]}</span>
                </div>
              )}

              {/* Overlay states */}
              {isAdmin && (isDraggingProfile || isUploadingProfile) && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  {isUploadingProfile
                    ? <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    : <p className="text-white text-xs text-center px-2">Drop to upload</p>
                  }
                </div>
              )}
              {isAdmin && !isDraggingProfile && !isUploadingProfile && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center group">
                  <p className="text-white/90 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-center px-2 leading-snug">
                    📁 클릭 또는<br/>드래그 업로드
                  </p>
                </div>
              )}
            </div>
            <input
              ref={profileFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadProfileFile(f) }}
            />
          </div>

          {/* Info */}
          <div className="space-y-3 flex-1">
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-headline text-3xl sm:text-4xl text-foreground">{model.name}</h1>
                <span className="text-lg text-muted-foreground">{model.nameKo}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground uppercase tracking-wider">
                  {model.nationality}
                </span>
                <span className="text-xs text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">Virtual Idol</span>
              </div>
            </div>
            {bio && <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{bio}</p>}
            <a
              href={deviantArtUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/25 rounded px-3 py-1.5 hover:border-primary/50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              View on DeviantArt
            </a>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* ── Gallery ───────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <h2 className="font-headline text-xl text-foreground">Photo Lookbook</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {galleryEntries.length > 0
                ? `${galleryEntries.length}개`
                : "Gallery coming soon"}
            </p>
          </div>

          {/* ── Admin Panel ─────────────────────────────────────────────── */}
          {isAdmin && (
            <div className="rounded border border-primary/30 bg-primary/5 divide-y divide-primary/10">

              {/* Add new entry form */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-primary font-semibold uppercase tracking-widest">
                  Admin — 이미지 등록
                </p>

                <div className="space-y-2">
                  {/* Thumbnail — drag file or paste URL */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      썸네일 이미지
                      <span className="text-muted-foreground/50 ml-1">(파일 드래그 or URL 입력)</span>
                    </label>

                    {/* Drop zone */}
                    <div
                      className={cn(
                        "relative flex items-center justify-center rounded border-2 border-dashed transition-colors cursor-pointer",
                        "h-32 overflow-hidden",
                        isDraggingGallery
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-input/40",
                        isUploadingGalleryImage && "opacity-60 pointer-events-none"
                      )}
                      onDragOver={e => { e.preventDefault(); setIsDraggingGallery(true) }}
                      onDragLeave={() => setIsDraggingGallery(false)}
                      onDrop={handleGalleryDrop}
                      onClick={() => galleryFileInputRef.current?.click()}
                    >
                      {isUploadingGalleryImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          <span className="text-xs text-muted-foreground">업로드 중...</span>
                        </div>
                      ) : newImageUrl ? (
                        /* Preview */
                        <>
                          <Image
                            src={newImageUrl}
                            alt="preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs">변경하려면 드래그 or 클릭</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted-foreground/60 select-none">
                          <span className="text-2xl">🖼️</span>
                          <span className="text-xs">파일 드래그 또는 클릭</span>
                        </div>
                      )}
                    </div>

                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadGalleryFile(f) }}
                    />

                    {/* URL input below drop zone */}
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={e => setNewImageUrl(e.target.value)}
                      placeholder="또는 https://... URL 직접 입력 (Arc, Ezel)"
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded border bg-input text-foreground",
                        "border-border focus:outline-none focus:ring-1 focus:ring-ring",
                        "placeholder:text-muted-foreground/40"
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      연결 주소 <span className="text-muted-foreground/50">(클릭 시 이동 — DeviantArt, Ezel 포스트 등)</span>
                    </label>
                    <input
                      type="url"
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddEntry()}
                      placeholder="https://www.deviantart.com/rainskiss-x/art/..."
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded border bg-input text-foreground",
                        "border-border focus:outline-none focus:ring-1 focus:ring-ring",
                        "placeholder:text-muted-foreground/40"
                      )}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddEntry}
                  disabled={isAddingEntry || !newImageUrl.trim()}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm rounded",
                    "bg-primary text-primary-foreground font-medium",
                    "hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                  )}
                >
                  {isAddingEntry && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  + 등록
                </button>
              </div>

              {/* Registered entries list */}
              {galleryEntries.length > 0 && (
                <div className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">등록된 이미지 ({galleryEntries.length})</p>
                  <div className="space-y-2">
                    {galleryEntries.map(entry => (
                      <div
                        key={entry.id}
                        className="flex items-start gap-3 p-2 rounded border border-border/60 bg-background/40"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 shrink-0 rounded overflow-hidden border border-border">
                          <Image
                            src={entry.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        {/* URLs */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-xs text-muted-foreground/60 truncate">
                            <span className="text-muted-foreground">이미지:</span>{" "}
                            {entry.imageUrl}
                          </p>
                          <p className="text-xs text-muted-foreground/60 truncate">
                            <span className="text-muted-foreground">링크:</span>{" "}
                            {entry.linkUrl ? (
                              <a
                                href={entry.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {entry.linkUrl}
                              </a>
                            ) : (
                              <span className="text-muted-foreground/40 italic">없음</span>
                            )}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => handleRemoveEntry(entry.id)}
                          disabled={removingId === entry.id}
                          className="shrink-0 p-1.5 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          {removingId === entry.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Public Gallery ───────────────────────────────────────────── */}
          <LookbookGallery entries={galleryEntries} modelName={model.name} />
        </section>

        <div className="border-t border-border" />

        {/* ── Request Board ─────────────────────────────────────────────── */}
        <RequestBoard
          modelSlug={model.slug}
          modelName={model.name}
          deviantArtUrl={deviantArtUrl}
        />
      </div>

      <footer className="border-t border-border mt-16 px-6 py-6 text-center text-xs text-muted-foreground/40">
        rainskiss © {new Date().getFullYear()} · All characters are AI-generated fictional personas
      </footer>

      {/* ── Admin Password Modal ─────────────────────────────────────────── */}
      {showAdminModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
          onClick={() => { setShowAdminModal(false); setAdminPw(""); setAdminPwError("") }}
        >
          <div
            className="w-full max-w-sm bg-card border border-border rounded p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">Admin 접근</h3>
              </div>
              <button
                onClick={() => { setShowAdminModal(false); setAdminPw(""); setAdminPwError("") }}
                className="text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                value={adminPw}
                onChange={e => { setAdminPw(e.target.value); setAdminPwError("") }}
                placeholder="관리자 비밀번호"
                autoFocus
                className={cn(
                  "w-full px-3 py-2 text-sm rounded border bg-input text-foreground",
                  "border-border focus:outline-none focus:ring-1 focus:ring-ring",
                  "placeholder:text-muted-foreground/40",
                  adminPwError && "border-red-600/60"
                )}
              />
              {adminPwError && (
                <p className="text-xs text-red-400">{adminPwError}</p>
              )}
              <button
                type="submit"
                disabled={isCheckingPw || !adminPw.trim()}
                className={cn(
                  "w-full py-2 text-sm rounded font-medium",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isCheckingPw && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isCheckingPw ? "확인 중..." : "입장"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
