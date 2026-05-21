"use client"

import {useState, useEffect, useRef} from "react"
import Image from "next/image"
import Link from "next/link"
import {database} from "@/api/firebase"
import {ref, onValue, push, remove} from "firebase/database"
import type {ShopProduct} from "@/data/shop-products"
import AdaptiveGallery from "@/app/components/AdaptiveGallery"
// Removed auth imports

type GalleryItem = {id: string; url: string}

export default function ProductClient({product}: {product: ShopProduct}) {
  // Removed auth - everyone can access all features now
  const isAdmin = true // Always allow admin features
  const [promptOpen, setPromptOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Prompt password protection
  const [promptAuthenticated, setPromptAuthenticated] = useState(false)
  const [promptPasswordInput, setPromptPasswordInput] = useState("")
  const [promptPasswordError, setPromptPasswordError] = useState(false)

  const PROMPT_PASSWORD = "phi" // Simple phi password for prompts

  const handlePromptPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (promptPasswordInput === PROMPT_PASSWORD) {
      setPromptAuthenticated(true)
      setPromptPasswordError(false)
      sessionStorage.setItem(`rainskiss_prompt_auth_${product.slug}`, "true")
    } else {
      setPromptPasswordError(true)
      setTimeout(() => setPromptPasswordError(false), 2000)
    }
  }

  // Check sessionStorage for previous prompt auth
  useEffect(() => {
    const stored = sessionStorage.getItem(`rainskiss_prompt_auth_${product.slug}`)
    if (stored === "true") {
      setPromptAuthenticated(true)
    }
  }, [product.slug])

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const [gallery, setGallery] = useState<GalleryItem[]>(
    product.gallery.map((url, i) => ({id: `static-${i}`, url}))
  )
  const [selected, setSelected] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  // Firebase에서 갤러리 실시간 로드
  useEffect(() => {
    const dbRef = ref(database, `/shop/${product.slug}/gallery`)
    const unsub = onValue(dbRef, snap => {
      if (!snap.exists()) return
      const data = snap.val() as Record<string, {url: string}>
      const items = Object.entries(data).map(([id, v]) => ({id, url: v.url}))
      setGallery(items)
    })
    return () => unsub()
  }, [product.slug])

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true)
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      const form = new FormData()
      form.append("file", file)
      form.append("slug", product.slug)
      const res = await fetch("/api/shop-upload", {method: "POST", body: form})
      if (res.ok) {
        const {url} = await res.json()
        await push(ref(database, `/shop/${product.slug}/gallery`), {url})
      }
    }
    setUploading(false)
  }

  async function deleteImage(item: GalleryItem) {
    if (item.id.startsWith("static-")) return
    await remove(ref(database, `/shop/${product.slug}/gallery/${item.id}`))
    setSelected(0)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFiles(files)
      e.target.value = '' // Reset input
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }
  function onDragLeave() {
    setDragging(false)
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }

  const currentImage = gallery[selected]?.url ?? product.previewImage

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <Link
          href="/shop"
          className="text-sm text-white/30 hover:text-white/60 transition mb-8 inline-block"
        >
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
          {/* 갤러리 */}
          <div className="flex flex-col gap-3">
            {/* 메인 이미지 + 드래그드롭 영역 */}
            <div
              ref={dropRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 transition ${
                dragging ? "ring-2 ring-[#c10002] ring-offset-2 ring-offset-[#0e0e0e]" : ""
              }`}
            >
              <Image
                src={currentImage}
                alt={product.title.en}
                fill
                className="object-cover object-top transition duration-500"
                priority
              />

              {/* 드래그 오버레이 */}
              {dragging && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <p className="text-white font-bold text-lg">Drop to upload</p>
                </div>
              )}

              {/* 업로드 중 */}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <p className="text-white text-sm animate-pulse">Uploading...</p>
                </div>
              )}

              {/* 파일 업로드 */}
              {!dragging && !uploading && (
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  <span className="text-[10px] bg-white/10 text-white/50 px-2 py-1 rounded-full">
                    drag to add
                  </span>
                  <label className="cursor-pointer">
                    <span className="text-[10px] bg-[#c10002] text-white px-2 py-1 rounded-full hover:bg-[#a00001] transition">
                      choose files
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* 삭제 버튼 */}
              {currentImage && !gallery[selected]?.id.startsWith("static-") && (
                <button
                  onClick={() => deleteImage(gallery[selected])}
                  className="absolute bottom-3 right-3 z-10 text-xs bg-black/60 text-white/60 hover:text-red-400 px-2 py-1 rounded-full transition"
                >
                  Delete
                </button>
              )}

              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                  Flow Preview
                </span>
              </div>
            </div>

            {/* 썸네일 */}
            <div className="flex gap-2 flex-wrap">
              {gallery.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                    selected === i
                      ? "border-[#c10002]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase mb-3">
                AI Clothing Prompt · Erotic Edition
              </p>
              <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
                {product.title.en}
              </h1>
              <p className="text-white/40 text-sm italic mb-5">
                {product.tagline.en}
              </p>
              <p className="text-white/60 text-sm leading-7">
                {product.description.en}
              </p>
            </div>

            {/* 코디 팁 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">
                Styling Tips
              </p>
              <ul className="space-y-2">
                {product.stylingTipsLang.en.map((tip, i) => (
                  <li key={i} className="text-sm text-white/60 flex gap-2">
                    <span className="text-[#c10002] mt-0.5 flex-shrink-0">›</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* 패키지 구성 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">
                Package includes
              </p>
              <ul className="space-y-1.5">
                {[
                  "✦ Full Grok prompt (erotic version)",
                  "✦ Flow & Grok image gallery",
                  "✦ Styling & coordinator notes",
                  "✦ NotebookLM fashion slides",
                ].map((item, i) => (
                  <li key={i} className="text-sm text-white/60">{item}</li>
                ))}
              </ul>
            </div>

            {/* 구매 */}
            <div id="purchase">
              <p className="text-4xl font-extrabold text-white mb-4">
                {product.price}
              </p>

              <div className="space-y-3">
                {/* DeviantArt 구매 버튼 */}
                <a
                  href={product.content.slideshowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#c10002] hover:bg-[#a00002] text-white font-bold py-4 px-6 rounded-2xl transition duration-300 text-center block"
                >
                  🛒 Buy Now on DeviantArt
                </a>

                {/* 무료 미리보기 안내 */}
                <div className="text-center pt-2">
                  <p className="text-xs text-white/40 mb-1">
                    Free Flow previews available on
                  </p>
                  <a
                    href="https://deviantart.com/rainskiss-x"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-white transition underline"
                  >
                    DeviantArt / rainskiss-x ↗
                  </a>
                </div>
              </div>

              {/* 프롬프트 열람 — 암호 보호 */}
              <div className="border-t border-white/10 pt-5">
                {!promptAuthenticated ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setPromptOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-sm transition"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1L9 4h6l-3-3zm0 22l3-3H9l3 3zm9-9l-3-3v6l3-3zM3 12l3 3V9l-3 3z"/>
                      </svg>
                      View Mathematical Prompts
                    </button>

                    {promptOpen && (
                      <form onSubmit={handlePromptPasswordSubmit} className="space-y-3">
                        <input
                          type="password"
                          placeholder="Prompt Access Code"
                          value={promptPasswordInput}
                          onChange={(e) => setPromptPasswordInput(e.target.value)}
                          className={`w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 transition text-sm text-center ${
                            promptPasswordError ? 'focus:ring-red-500 border-red-500' : 'focus:ring-[#c10002]'
                          }`}
                          autoFocus
                        />
                        {promptPasswordError && (
                          <p className="text-red-400 text-xs text-center animate-pulse">
                            Invalid prompt access code
                          </p>
                        )}
                        <button
                          type="submit"
                          className="w-full px-3 py-2 bg-[#c10002] hover:bg-[#a00001] text-white text-sm font-medium rounded-lg transition"
                        >
                          UNLOCK PROMPTS
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setPromptOpen(p => !p)}
                      className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-[#c10002]/40 bg-[#c10002]/10 hover:bg-[#c10002]/20 text-white text-sm font-medium transition"
                    >
                      <span>Mathematical Prompts φ</span>
                      <span className="text-white/40 text-xs">{promptOpen ? "▲" : "▼"}</span>
                    </button>

                    {promptOpen && (
                      <div className="mt-3 space-y-3">
                        {/* Clothing Prompt */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">φ Clothing Prompt</p>
                            <button
                              onClick={() => copyToClipboard(product.content.clothingPrompt, "clothing")}
                              className="text-[10px] text-white/40 hover:text-white transition"
                            >
                              {copied === "clothing" ? "Copied ✓" : "Copy"}
                            </button>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed font-mono">
                            {product.content.clothingPrompt}
                          </p>
                        </div>

                        {/* Model Prompt */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">π Model Prompt</p>
                            <button
                              onClick={() => copyToClipboard(product.content.modelPrompt, "model")}
                              className="text-[10px] text-white/40 hover:text-white transition"
                            >
                              {copied === "model" ? "Copied ✓" : "Copy"}
                            </button>
                          </div>
                          <p className="text-xs text-white/70 leading-relaxed font-mono">
                            {product.content.modelPrompt}
                          </p>
                        </div>

                        {/* 7-Tier Prompts */}
                        <div className="bg-gradient-to-br from-[#c10002]/10 to-[#c10002]/5 border border-[#c10002]/20 rounded-xl p-4">
                          <p className="text-[10px] font-semibold tracking-widest text-[#c10002] uppercase mb-3">7-Tier Mathematical Series</p>
                          <div className="space-y-2 text-xs">
                            {Object.entries(product.tieredPrompts).slice(0, 7).map(([key, prompt]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-white/60 text-[10px] uppercase tracking-wide">{key.replace('level', 'T').replace('_', ' ')}</span>
                                <button
                                  onClick={() => copyToClipboard(prompt, key)}
                                  className="text-[10px] text-[#c10002]/60 hover:text-[#c10002] transition"
                                >
                                  {copied === key ? "✓" : "Copy"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 px-1">
                      <p className="text-[10px] text-white/20">
                        Authenticated · φ Access
                      </p>
                      <button
                        onClick={() => {
                          setPromptAuthenticated(false)
                          sessionStorage.removeItem(`rainskiss_prompt_auth_${product.slug}`)
                        }}
                        className="text-[10px] text-white/20 hover:text-white/50 transition"
                      >
                        Lock prompts
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      <AdaptiveGallery images={gallery.map((g) => g.url)} ctaHref="#purchase" />
    </div>
  )
}
