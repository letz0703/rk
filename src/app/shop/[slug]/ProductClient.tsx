"use client"

import {useState, useEffect, useRef} from "react"
import Image from "next/image"
import {database} from "@/api/firebase"
import {ref, push, set, onValue, remove, get} from "firebase/database"
import type {ShopProduct} from "@/data/shop-products"
import {useAuthContext} from "@/components/context/AuthContext"
import {isValidImageUrl} from "@/utils/image"

type GalleryItem = {id: string; url: string}

export default function ProductClient({product}: {product: ShopProduct}) {
  const {isAdmin, user} = useAuthContext()

  // Hard prompt access restricted to specific admins
  const isHardPromptAdmin = user?.email === 'rainskiss@gmail.com' || user?.email === 'icanmart@gmail.com'

  // States
  const [copied, setCopied] = useState<string | null>(null)
  const [editMode, setEditMode] = useState<{[key: string]: boolean}>({})
  const [editedPrompts, setEditedPrompts] = useState<{[key: string]: string}>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [blogNote, setBlogNote] = useState("")
  const [editingBlog, setEditingBlog] = useState(false)

  const [gallery, setGallery] = useState<GalleryItem[]>(
    product.gallery
      .filter(isValidImageUrl)
      .map((url, i) => ({id: `static-${i}`, url}))
  )
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  // 갤러리 이미지별 admin 전용 프롬프트/메모
  const [galleryNotes, setGalleryNotes] = useState<{[key: string]: string}>({})
  const [editingNote, setEditingNote] = useState<string | null>(null)

  // 이미지 URL → Firebase 안전 키 (파일명 베이스, 확장자/특수문자 제거)
  function noteKey(url: string) {
    return (url.split("/").pop() || url).replace(/\.[^.]+$/, "").replace(/[.#$/[\]]/g, "_")
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function startEdit(key: string, currentText: string) {
    setEditMode({...editMode, [key]: true})
    setEditedPrompts({...editedPrompts, [key]: currentText})
  }

  function cancelEdit(key: string) {
    const newEditMode = {...editMode}
    delete newEditMode[key]
    setEditMode(newEditMode)

    // Don't clear editedPrompts on save - keep saved content for display
  }

  async function savePrompt(key: string) {
    if (!isAdmin) return
    setSaving(key)
    try {
      console.log("Saving prompt with user:", user?.email)
      await set(ref(database, `/fashion-diary/${product.slug}/prompts/${key}`), {
        text: editedPrompts[key],
        timestamp: new Date().toISOString(),
        version: Date.now()
      })
      cancelEdit(key)
    } catch (error: any) {
      console.error("Failed to save prompt:", error)
      alert(`Save failed: ${error?.message || 'Unknown error'}`)
    } finally {
      setSaving(null)
    }
  }

  async function saveBlogNote() {
    if (!isAdmin) return
    try {
      console.log("Saving blog note with user:", user?.email)
      await set(ref(database, `/fashion-diary/${product.slug}/blog`), {
        content: blogNote,
        timestamp: new Date().toISOString()
      })
      setEditingBlog(false)
    } catch (error: any) {
      console.error("Failed to save blog note:", error)
      alert(`Save failed: ${error?.message || 'Unknown error'}`)
    }
  }

  async function saveGalleryNote(url: string) {
    if (!isAdmin) return
    const key = noteKey(url)
    try {
      await set(ref(database, `/fashion-diary/${product.slug}/galleryNotes/${key}`), {
        text: galleryNotes[key] || "",
        timestamp: new Date().toISOString()
      })
      setEditingNote(null)
    } catch (error: any) {
      console.error("Failed to save gallery note:", error)
      alert(`Save failed: ${error?.message || "Unknown error"}`)
    }
  }

  // Load saved data from Firebase
  useEffect(() => {
    if (!user?.email || !isAdmin) return

    console.log("Loading data for admin user:", user.email, "UID:", user.uid)

    // Load blog note
    const blogRef = ref(database, `/fashion-diary/${product.slug}/blog`)
    get(blogRef).then(snap => {
      if (snap.exists()) {
        const data = snap.val()
        console.log("Loaded blog data:", data)
        setBlogNote(data.content || "")
      } else {
        console.log("No blog data found")
      }
    }).catch((error: any) => console.error("Blog load error:", error))

    // Load saved prompts
    const promptsRef = ref(database, `/fashion-diary/${product.slug}/prompts`)
    get(promptsRef).then(snap => {
      if (snap.exists()) {
        const data = snap.val()
        console.log("Loaded prompts data:", data)
        const prompts: {[key: string]: string} = {}
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          prompts[key] = value.text || ""
        })
        setEditedPrompts(prompts)
      } else {
        console.log("No prompts data found")
      }
    }).catch((error: any) => console.error("Prompts load error:", error))

    // Load gallery notes (이미지별 admin 전용 메모)
    const notesRef = ref(database, `/fashion-diary/${product.slug}/galleryNotes`)
    get(notesRef).then(snap => {
      if (snap.exists()) {
        const data = snap.val()
        const notes: {[key: string]: string} = {}
        Object.entries(data).forEach(([k, v]: [string, any]) => {
          notes[k] = v.text || ""
        })
        setGalleryNotes(notes)
      }
    }).catch((error: any) => console.error("Gallery notes load error:", error))
  }, [product.slug, user?.email, isAdmin])

  async function uploadFiles(files: FileList | File[]) {
    if (!isAdmin) return
    setUploading(true)
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      const form = new FormData()
      form.append("file", file)
      form.append("slug", product.slug)
      try {
        const res = await fetch("/api/shop-upload", {method: "POST", body: form})
        if (res.ok) {
          const {url} = await res.json()
          // Firebase Storage URL로 갤러리에 추가
          await push(ref(database, `/fashion-diary/${product.slug}/gallery`), {url})
        }
      } catch (error) {
        console.error("Upload failed:", error)
      }
    }
    setUploading(false)
  }

  async function deleteImage(item: GalleryItem) {
    if (!isAdmin || item.id.startsWith("static-")) return
    // Firebase 제거 대신 로컬 state에서만 제거
    setGallery(prev => prev.filter(g => g.id !== item.id))
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) uploadFiles(files)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFiles(files)
      e.target.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] font-sans text-white antialiased">
      <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">

        {/* Header — asterix */}
        <div className="mb-12">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            — {product.category}
          </p>
          <h1
            className="font-semibold leading-[0.9] tracking-[-0.03em]"
            style={{fontSize: "clamp(2.25rem, 6vw, 4.5rem)"}}
          >
            {product.title.en}
          </h1>
          <p className="mt-5 font-serif text-lg italic text-white/50">
            {product.tagline.en}
          </p>
        </div>

        {/* Personal Research Note (Blog Post Style) */}
        {isAdmin && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">연구 노트</h2>
              {!editingBlog && (
                <button
                  onClick={() => setEditingBlog(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  편집
                </button>
              )}
            </div>

            {editingBlog ? (
              <div className="space-y-3">
                <textarea
                  value={blogNote}
                  onChange={(e) => setBlogNote(e.target.value)}
                  placeholder="이 의상에 대한 연구 내용, 아이디어, 참고 링크 등을 자유롭게 작성하세요..."
                  className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveBlogNote}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingBlog(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-white/70 whitespace-pre-wrap">
                {blogNote || "연구 노트가 비어있습니다. 편집 버튼을 눌러 내용을 추가하세요."}
              </div>
            )}
          </div>
        )}

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">갤러리</h3>
            {isAdmin && (
              <label className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded cursor-pointer transition">
                이미지 추가
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`grid grid-cols-2 gap-4 transition-colors ${
              dragging && isAdmin ? 'bg-blue-500/10 border-2 border-dashed border-blue-500' : ''
            } ${isAdmin ? 'p-4 rounded-lg' : ''}`}
          >
            {gallery.filter(item => isValidImageUrl(item.url)).map((item, i) => {
              const k = noteKey(item.url)
              return (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden group">
                  <Image
                    src={item.url}
                    alt={`${product.title.en} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  {isAdmin && !item.id.startsWith('static-') && (
                    <button
                      onClick={() => deleteImage(item)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  )}
                </div>
                {/* 이미지별 admin 전용 프롬프트/메모 (공개 X) */}
                {isAdmin && (
                  <div className="text-xs">
                    {editingNote === k ? (
                      <div className="space-y-1">
                        <textarea
                          value={galleryNotes[k] || ""}
                          onChange={e => setGalleryNotes({...galleryNotes, [k]: e.target.value})}
                          placeholder="이 이미지 프롬프트/메모 (admin 전용)"
                          className="w-full h-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <div className="flex gap-1">
                          <button onClick={() => saveGalleryNote(item.url)} className="px-2 py-0.5 bg-green-600 hover:bg-green-500 text-white rounded text-[11px] transition">저장</button>
                          <button onClick={() => setEditingNote(null)} className="px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-white rounded text-[11px] transition">취소</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingNote(k)}
                        className="w-full text-left text-white/45 hover:text-white/80 whitespace-pre-wrap transition"
                      >
                        {galleryNotes[k] || "+ 프롬프트/메모 추가 (admin)"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )})}

            {isAdmin && gallery.length === 0 && (
              <div className="col-span-2 border-2 border-dashed border-white/20 rounded-lg p-8 text-center text-white/40">
                <p>이미지를 드래그 앤 드롭하거나 위의 버튼으로 추가하세요</p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-2 text-center text-blue-400 text-sm">
              업로드 중...
            </div>
          )}
        </div>

        {/* Prompt Research Section */}
        {isAdmin && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">프롬프트 연구</h3>

            {/* Soft Prompt */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-400">SOFT Prompt</h4>
                <div className="flex gap-2">
                  {!editMode.soft && (
                    <button
                      onClick={() => startEdit("soft", product.content.clothingPrompt)}
                      className="text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                      편집
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(editedPrompts.soft || product.content.clothingPrompt, "soft")}
                    className="text-sm text-white/40 hover:text-white transition"
                  >
                    {copied === "soft" ? "복사됨 ✓" : "복사"}
                  </button>
                </div>
              </div>

              {editMode.soft ? (
                <div className="space-y-3">
                  <textarea
                    value={editedPrompts.soft || ""}
                    onChange={(e) => setEditedPrompts({...editedPrompts, soft: e.target.value})}
                    className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded text-white font-mono resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => savePrompt("soft")}
                      disabled={saving === "soft"}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white text-xs rounded transition"
                    >
                      {saving === "soft" ? "저장중..." : "저장"}
                    </button>
                    <button
                      onClick={() => cancelEdit("soft")}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-white/70 font-mono leading-relaxed whitespace-pre-wrap">
                  {editedPrompts.soft || product.content.clothingPrompt}
                </div>
              )}
            </div>

            {/* Hard Prompt - Admin Only */}
            {isHardPromptAdmin && (
              <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-red-400">HARD Prompt</h4>
                  <div className="flex gap-2">
                    {!editMode.hard && (
                      <button
                        onClick={() => startEdit("hard", Object.entries(product.tieredPrompts).slice(0, 7).map(([key, prompt]) => `${key}: ${prompt}`).join('\n\n'))}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        편집
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(editedPrompts.hard || Object.entries(product.tieredPrompts).slice(0, 7).map(([key, prompt]) => `${key}: ${prompt}`).join('\n\n'), "hard")}
                      className="text-sm text-red-400/60 hover:text-red-400 transition"
                    >
                      {copied === "hard" ? "복사됨 ✓" : "복사"}
                    </button>
                  </div>
                </div>

                {editMode.hard ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedPrompts.hard || ""}
                      onChange={(e) => setEditedPrompts({...editedPrompts, hard: e.target.value})}
                      className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded text-white font-mono resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="level1_clothing: prompt text here&#10;&#10;level2_background: prompt text here&#10;..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => savePrompt("hard")}
                        disabled={saving === "hard"}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white text-xs rounded transition"
                      >
                        {saving === "hard" ? "저장중..." : "저장"}
                      </button>
                      <button
                        onClick={() => cancelEdit("hard")}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/70 font-mono leading-relaxed whitespace-pre-wrap">
                    {editedPrompts.hard || Object.entries(product.tieredPrompts).slice(0, 7).map(([key, prompt]) => `${key}: ${prompt}`).join('\n\n')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* External Links */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">관련 링크</h3>
          <div className="flex gap-3">
            <a
              href={product.content.slideshowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#c10002] hover:bg-[#a00002] text-white font-medium rounded-lg transition"
            >
              DeviantArt에서 보기
            </a>
            <button
              onClick={() => copyToClipboard(window.location.href, "page-url")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition"
            >
              {copied === "page-url" ? "복사됨 ✓" : "페이지 링크 복사"}
            </button>
          </div>
        </div>

        {/* Back to Gallery */}
        <div className="mt-8 text-center">
          <a
            href="/shop"
            className="text-white/60 hover:text-white transition text-sm"
          >
            ← 갤러리로 돌아가기
          </a>
        </div>

      </div>
    </div>
  )
}