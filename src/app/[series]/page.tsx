"use client"

import { useAuthContext } from "@/components/context/AuthContext"
import { notFound } from "next/navigation"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import rawSeries from "@/app/series-data.json"
import { getModel } from "@/app/models/data"
import AgeGate from "@/components/AgeGate"

const ADMIN_EMAIL = "rainskiss@gmail.com"

type SeriesGalleryItem = {
  id: string
  imageUrl: string
  deviantartUrl: string
  modelSlug: string
  memo: string
}

type Series = {
  slug: string
  title: string
  subtitle: string
  era: string
  location: string
  description: string
  models: string[]
  gallery: SeriesGalleryItem[]
}

const allSeries: Series[] = rawSeries as Series[]

function getSeries(slug: string) {
  return allSeries.find(s => s.slug === slug)
}

export default function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const { series: slug } = use(params)
  const { user } = useAuthContext()
  const isAdmin = user?.email === ADMIN_EMAIL
  const seriesMeta = getSeries(slug)
  if (!seriesMeta) notFound()

  return (
    <AgeGate>
      <SeriesContent series={seriesMeta} isAdmin={isAdmin} />
    </AgeGate>
  )
}

function SeriesContent({ series, isAdmin }: { series: Series; isAdmin: boolean }) {
  const [gallery, setGallery] = useState<SeriesGalleryItem[]>(series.gallery ?? [])
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ imageUrl: "", deviantartUrl: "", modelSlug: "", memo: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/series-meta?slug=${series.slug}`)
      .then(r => r.json())
      .then(data => { if (data?.gallery) setGallery(data.gallery) })
      .catch(() => {})
  }, [series.slug])

  const handleAdd = async () => {
    if (!form.imageUrl) return
    setSaving(true)
    const item: SeriesGalleryItem = { id: crypto.randomUUID(), ...form }
    const next = [...gallery, item]
    setGallery(next)
    await fetch("/api/series-meta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: series.slug, action: "add-item", item }),
    })
    setForm({ imageUrl: "", deviantartUrl: "", modelSlug: "", memo: "" })
    setAddOpen(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("삭제할까요?")) return
    setGallery(g => g.filter(i => i.id !== id))
    await fetch("/api/series-meta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: series.slug, action: "delete-item", id }),
    })
  }

  const featuredModels = series.models.map(getModel).filter(Boolean)

  return (
    <main className="min-h-screen bg-[#080808] text-white selection:bg-[#c10002]/30">
      {/* 헤더 */}
      <div className="relative px-6 pt-16 pb-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="group flex items-center gap-1 text-xs text-white/20 hover:text-white/60 mb-12 transition-colors font-bold uppercase tracking-widest">
            <span className="transition-transform group-hover:-translate-x-1">←</span> rainskiss
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c10002] mb-4">
                {series.location} · {series.era}
              </p>
              <h1 className="text-[clamp(5rem,15vw,12rem)] font-black leading-none tracking-tighter text-white uppercase italic">
                {series.title}
              </h1>
              <p className="text-white/30 text-lg font-medium mt-4 max-w-xl leading-relaxed">
                {series.subtitle}
              </p>
              <p className="text-white/50 text-sm mt-3 max-w-lg leading-relaxed">
                {series.description}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 출연 모델 */}
      <div className="px-6 py-14 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Cast</p>
          <div className="flex flex-wrap gap-8">
            {featuredModels.map(model => model && (
              <Link key={model.slug} href={`/models/${model.slug}`} className="group flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 group-hover:border-[#c10002]/60 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {model.profileImage
                    ? <img src={model.profileImage} alt={model.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-white/5 flex items-center justify-center text-lg">👤</div>
                  }
                </div>
                <div>
                  <p className="text-sm font-black italic uppercase group-hover:text-[#c10002] transition-colors">{model.nameKo}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{model.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 갤러리 */}
      <div className="px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-2">Gallery</p>
              <h2 className="text-2xl font-black italic uppercase text-white">Selected Frames</h2>
            </div>
            {isAdmin && (
              <button
                onClick={() => setAddOpen(o => !o)}
                className="px-5 py-2 rounded-full border border-[#c10002]/40 text-[#c10002] text-[10px] font-black uppercase tracking-widest hover:bg-[#c10002]/10 transition"
              >
                + ADD IMAGE
              </button>
            )}
          </div>

          {/* 어드민 추가 폼 */}
          {isAdmin && addOpen && (
            <div className="mb-10 p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
              <p className="text-[10px] font-black text-[#c10002] uppercase tracking-widest">NEW FRAME</p>
              <input
                value={form.imageUrl}
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                placeholder="DA-x Image URL (직접 이미지 주소)"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c10002]/50"
              />
              <input
                value={form.deviantartUrl}
                onChange={e => setForm(f => ({ ...f, deviantartUrl: e.target.value }))}
                placeholder="DA-x 작품 페이지 URL (클릭 시 이동)"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c10002]/50"
              />
              <select
                value={form.modelSlug}
                onChange={e => setForm(f => ({ ...f, modelSlug: e.target.value }))}
                className="w-full rounded-xl bg-[#080808] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c10002]/50"
              >
                <option value="">모델 태그 (선택)</option>
                {series.models.map(slug => {
                  const m = getModel(slug)
                  return m ? <option key={slug} value={slug}>{m.nameKo} ({m.name})</option> : null
                })}
              </select>
              <input
                value={form.memo}
                onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
                placeholder="내부 메모"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c10002]/50"
              />
              {form.imageUrl && (
                <div className="w-32 aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={saving || !form.imageUrl}
                  className="px-8 py-3 rounded-full bg-[#c10002] text-white text-[10px] font-black uppercase tracking-widest hover:brightness-125 disabled:opacity-40 transition"
                >
                  {saving ? "SAVING..." : "ADD"}
                </button>
                <button
                  onClick={() => setAddOpen(false)}
                  className="px-8 py-3 rounded-full border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {/* 갤러리 그리드 */}
          {gallery.length === 0 ? (
            <div className="text-center py-24 text-white/10 text-sm font-bold uppercase tracking-widest">
              No frames yet.
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {gallery.map(item => {
                const model = item.modelSlug ? getModel(item.modelSlug) : null
                return (
                  <div key={item.id} className="group relative break-inside-avoid rounded-2xl overflow-hidden border border-white/5 bg-white/3">
                    <a
                      href={item.deviantartUrl || undefined}
                      target={item.deviantartUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={item.deviantartUrl ? "cursor-pointer" : "cursor-default"}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={model?.name ?? ""}
                        className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {model && (
                        <div className="absolute bottom-3 left-3 text-[10px] font-black uppercase text-white/80 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          {model.nameKo}
                        </div>
                      )}
                      {item.deviantartUrl && (
                        <div className="absolute bottom-3 right-3 text-[10px] font-black text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          DA-x ↗
                        </div>
                      )}
                    </a>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white/50 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
