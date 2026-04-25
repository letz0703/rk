"use client"

import {useState, useEffect, useRef} from "react"
import Image from "next/image"
import Link from "next/link"
import {database} from "@/api/firebase"
import {ref, onValue, push, remove} from "firebase/database"
import {useAuthContext} from "@/components/context/AuthContext"
import type {ShopProduct} from "@/data/shop-products"
import AdaptiveGallery from "@/app/components/AdaptiveGallery"

type GalleryItem = {id: string; url: string}

export default function ProductClient({product}: {product: ShopProduct}) {
  const {isAdmin} = useAuthContext()

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
              onDragOver={isAdmin ? onDragOver : undefined}
              onDragLeave={isAdmin ? onDragLeave : undefined}
              onDrop={isAdmin ? onDrop : undefined}
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

              {/* 어드민 힌트 */}
              {isAdmin && !dragging && !uploading && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[10px] bg-white/10 text-white/50 px-2 py-1 rounded-full">
                    drag to add
                  </span>
                </div>
              )}

              {/* 삭제 버튼 (어드민) */}
              {isAdmin && currentImage && !gallery[selected]?.id.startsWith("static-") && (
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
              <a
                href={product.patreonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-4 rounded-full font-bold text-white text-base transition hover:opacity-80"
                style={{backgroundColor: "#c10002"}}
              >
                Purchase on Patreon →
              </a>
              <p className="text-xs text-white/20 text-center mt-3">
                Payment & delivery handled on Patreon
              </p>
            </div>
          </div>
        </div>
      </div>
      <AdaptiveGallery images={gallery.map((g) => g.url)} ctaHref="#purchase" />
    </div>
  )
}
