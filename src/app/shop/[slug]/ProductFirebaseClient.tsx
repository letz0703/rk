"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import Image from "next/image"
import {useAuthContext} from "@/components/context/AuthContext"
import {
  type FBProduct,
  emptyProduct,
  fbGetProduct,
  fbSaveProduct,
  fbSetStatus,
  fbUpdateProduct,
  fbDeleteProduct
} from "@/api/shopFirebase"
import {isValidImageUrl} from "@/utils/image"

const CATEGORIES = [
  "Street", "Uniform", "Swimwear", "Bodysuit", "Spring", "Summer",
  "Fall", "Winter", "Shoes", "Socks", "Background", "Accessories"
]

export default function ProductFirebaseClient({slug}: {slug: string}) {
  const {isAdmin} = useAuthContext()
  const router = useRouter()

  const [product, setProduct] = useState<FBProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<FBProduct>(emptyProduct(slug))
  const [saving, setSaving] = useState(false)
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceVal, setPriceVal] = useState(0)

  const [uploading, setUploading] = useState<"preview" | "gallery" | null>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, target: "preview" | "gallery") {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(target)

    try {
      if (target === "preview") {
        const file = files[0]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("slug", slug)
        const res = await fetch("/api/shop-upload", {
          method: "POST",
          body: formData
        })
        if (!res.ok) throw new Error("Upload failed")
        const {url} = await res.json()
        setDraft(prev => ({...prev, previewImage: url}))
      } else {
        const uploadedUrls: string[] = []
        for (const file of Array.from(files)) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("slug", slug)
          const res = await fetch("/api/shop-upload", {
            method: "POST",
            body: formData
          })
          if (res.ok) {
            const {url} = await res.json()
            uploadedUrls.push(url)
          }
        }
        if (uploadedUrls.length > 0) {
          setDraft(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []).filter(Boolean), ...uploadedUrls]
          }))
        }
      }
    } catch (err: any) {
      alert(`업로드 실패: ${err?.message || err}`)
    } finally {
      setUploading(null)
      e.target.value = ""
    }
  }

  async function savePrice() {
    if (!product) return
    try {
      await fbUpdateProduct(slug, {price: priceVal})
      setProduct({...product, price: priceVal})
      setEditingPrice(false)
    } catch (e: any) {
      alert(`가격 저장 실패: ${e?.message || e}`)
    }
  }

  useEffect(() => {
    fbGetProduct(slug)
      .then(p => setProduct(p))
      .catch(e => console.error("load product:", e))
      .finally(() => setLoading(false))
  }, [slug])

  function startEdit() {
    setDraft(product ?? emptyProduct(slug))
    setEditing(true)
  }

  async function save() {
    setSaving(true)
    try {
      await fbSaveProduct(draft)
      setProduct(draft)
      setEditing(false)
    } catch (e: any) {
      alert(`저장 실패: ${e?.message || e}`)
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus() {
    if (!product) return
    const next = product.status === "on" ? "off" : "on"
    try {
      await fbSetStatus(slug, next)
      setProduct({...product, status: next})
    } catch (e: any) {
      alert(`전시 전환 실패: ${e?.message || e}`)
    }
  }

  async function del() {
    if (!confirm("이 상품을 삭제할까요? 되돌릴 수 없습니다.")) return
    try {
      await fbDeleteProduct(slug)
      router.push("/shop")
    } catch (e: any) {
      alert(`삭제 실패: ${e?.message || e}`)
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-4xl px-6 py-20 text-white/50">불러오는 중…</div>
  }

  // 상품 없음 — admin이면 생성, 아니면 404 문구
  if (!product && !editing) {
    if (!isAdmin) {
      return <div className="mx-auto max-w-4xl px-6 py-20 text-white/50">상품을 찾을 수 없습니다.</div>
    }
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <p className="mb-4 text-white/60">'{slug}' 상품이 아직 없습니다.</p>
        <button onClick={startEdit} className="px-4 py-2 bg-[#c10002] hover:bg-[#a00001] text-white rounded-lg">+ 이 슬러그로 새 상품 만들기</button>
      </div>
    )
  }

  // 미전시(off) — 비admin에겐 숨김
  if (product && product.status === "off" && !isAdmin && !editing) {
    return <div className="mx-auto max-w-4xl px-6 py-20 text-white/50">상품을 찾을 수 없습니다.</div>
  }

  // ── 편집 모드 ──
  if (editing) {
    const set = (patch: Partial<FBProduct>) => setDraft({...draft, ...patch})
    const setPrompt = (k: keyof FBProduct["prompts"], v: string) =>
      setDraft({...draft, prompts: {...draft.prompts, [k]: v}})

    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-white">
        <h2 className="mb-6 text-2xl font-bold">상품 편집 — {slug}</h2>
        <div className="space-y-4">
          <Field label="제목"><input className={inp} value={draft.title} onChange={e => set({title: e.target.value})} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="카테고리">
              <select className={inp} value={draft.category} onChange={e => set({category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="가격 ($)"><input type="number" className={inp} value={draft.price} onChange={e => set({price: Number(e.target.value)})} /></Field>
          </div>
          <MainImageEditor
            url={draft.previewImage}
            onChange={url => set({previewImage: url})}
            onUpload={e => handleImageUpload(e, "preview")}
            uploading={uploading === "preview"}
          />
          <Field label="설명">
            <textarea
              className={`${inp} h-24`}
              value={draft.description}
              onChange={e => set({description: e.target.value})}
            />
          </Field>

          <GalleryVisualEditor
            urls={draft.gallery}
            onChange={g => set({gallery: g})}
            onUpload={e => handleImageUpload(e, "gallery")}
            uploading={uploading === "gallery"}
          />

          <Field label="SOFT 프롬프트"><textarea className={`${inp} h-28 font-mono`} value={draft.prompts.soft} onChange={e => setPrompt("soft", e.target.value)} /></Field>
          <Field label="HARD 프롬프트"><textarea className={`${inp} h-28 font-mono`} value={draft.prompts.hard} onChange={e => setPrompt("hard", e.target.value)} /></Field>
          <Field label="SOFT 모델 프롬프트"><textarea className={`${inp} h-24 font-mono`} value={draft.prompts.softModel} onChange={e => setPrompt("softModel", e.target.value)} /></Field>
          <Field label="HARD 모델 프롬프트"><textarea className={`${inp} h-24 font-mono`} value={draft.prompts.hardModel} onChange={e => setPrompt("hardModel", e.target.value)} /></Field>

          <div className="flex gap-3 pt-4">
            <button onClick={save} disabled={saving} className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg">{saving ? "저장중…" : "💾 저장"}</button>
            <button onClick={() => setEditing(false)} className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg">취소</button>
          </div>
        </div>
      </div>
    )
  }

  // ── 보기 모드 ──
  const p = product!
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-white">
      {isAdmin && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg bg-white/5 p-3">
          <span className={`text-xs px-2 py-1 rounded ${p.status === "on" ? "bg-green-600" : "bg-gray-600"}`}>
            {p.status === "on" ? "전시중" : "비전시"}
          </span>
          <button onClick={toggleStatus} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-sm rounded">{p.status === "on" ? "전시 OFF" : "전시 ON"}</button>
          <button onClick={startEdit} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-sm rounded">✏️ 편집</button>
          <button onClick={del} className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-sm rounded ml-auto">삭제</button>
        </div>
      )}

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">— {p.category}</p>
      <h1 className="text-4xl font-bold tracking-tight">{p.title}</h1>
      {isAdmin && editingPrice ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl text-[#c10002]">$</span>
          <input
            type="number"
            value={priceVal}
            onChange={e => setPriceVal(Number(e.target.value))}
            className="w-24 rounded border border-white/20 bg-white/10 px-2 text-2xl text-[#c10002] focus:outline-none focus:ring-1 focus:ring-[#c10002]"
          />
          <button onClick={savePrice} className="rounded bg-green-600 px-3 py-1 text-sm hover:bg-green-500">저장</button>
          <button onClick={() => setEditingPrice(false)} className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20">취소</button>
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-3 text-2xl text-[#c10002]">
          ${p.price}
          {isAdmin && (
            <button
              onClick={() => {setPriceVal(p.price); setEditingPrice(true)}}
              className="text-xs text-white/40 hover:text-white"
            >
              ✏️ 가격 수정
            </button>
          )}
        </p>
      )}

      {isValidImageUrl(p.previewImage) && (
        <div className="relative mt-6 aspect-[4/5] max-w-md overflow-hidden rounded-xl bg-white/5">
          <Image src={p.previewImage} alt={p.title} fill className="object-cover" />
        </div>
      )}

      {p.description && <p className="mt-6 whitespace-pre-wrap text-white/70">{p.description}</p>}

      {p.gallery.filter(isValidImageUrl).length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold">갤러리</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {p.gallery.filter(isValidImageUrl).map((url, i) => (
              <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-white/5">
                <Image src={url} alt={`${p.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 프롬프트 — admin만 평문, 비admin은 잠금 */}
      <div className="mt-10 space-y-4">
        <h3 className="text-lg font-semibold">프롬프트</h3>
        {isAdmin ? (
          <div className="space-y-3">
            <PromptBox label="SOFT" text={p.prompts.soft} />
            <PromptBox label="HARD" text={p.prompts.hard} />
            <PromptBox label="SOFT MODEL" text={p.prompts.softModel} />
            <PromptBox label="HARD MODEL" text={p.prompts.hardModel} />
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-white/40">
            🔒 구매 시 프롬프트가 공개됩니다.
          </div>
        )}
      </div>
    </div>
  )
}

const inp = "w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white resize-y focus:outline-none focus:ring-1 focus:ring-[#c10002]"

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/60">{label}</span>
      {children}
    </label>
  )
}

function PromptBox({label, text}: {label: string; text: string}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
      <div className="mb-2 text-xs font-semibold text-white/50">{label}</div>
      <pre className="whitespace-pre-wrap break-words font-mono text-sm text-white/90">{text || "—"}</pre>
    </div>
  )
}

function MainImageEditor({
  url,
  onChange,
  onUpload,
  uploading
}: {
  url: string
  onChange: (url: string) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
}) {
  const [showManual, setShowManual] = useState(false)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <span className="mb-2 block text-sm font-medium text-white/85">메인 이미지 (유리 마네킹 메인)</span>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Thumbnail Preview */}
        {isValidImageUrl(url) ? (
          <div className="relative aspect-[4/5] w-32 rounded-lg border border-white/20 overflow-hidden group">
            <Image src={url} alt="Main Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition"
              >
                삭제
              </button>
            </div>
          </div>
        ) : (
          <div className="aspect-[4/5] w-32 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-xs text-white/30 text-center p-2 bg-black/20">
            {uploading ? "업로드 중..." : "이미지 없음"}
          </div>
        )}

        {/* Upload Button & Control */}
        <div className="flex-1 w-full space-y-3">
          <label className="flex items-center justify-center px-4 py-3 border border-dashed border-white/25 rounded-xl cursor-pointer hover:border-[#c10002]/50 hover:bg-white/5 transition text-sm font-medium text-white/80">
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                업로드 중...
              </span>
            ) : (
              "📁 컴퓨터에서 파일 선택"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={onUpload}
            />
          </label>

          <div>
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="text-xs text-white/40 hover:text-white/80 transition"
            >
              {showManual ? "🔗 직접 URL 입력 숨기기" : "🔗 직접 URL 입력하기"}
            </button>
          </div>

          {showManual && (
            <input
              type="text"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#c10002]"
              value={url}
              onChange={e => onChange(e.target.value)}
              placeholder="https://... 또는 /shop/..."
            />
          )}
        </div>
      </div>
    </div>
  )
}

function GalleryVisualEditor({
  urls,
  onChange,
  onUpload,
  uploading
}: {
  urls: string[]
  onChange: (urls: string[]) => void
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
}) {
  const [showManual, setShowManual] = useState(false)
  const validUrls = urls.filter(isValidImageUrl)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white/80">갤러리 이미지 (모델 피팅컷 전시)</span>
        <button
          type="button"
          onClick={() => setShowManual(!showManual)}
          className="text-xs text-white/40 hover:text-white/80 transition"
        >
          {showManual ? "🔗 텍스트 링크 편집 숨기기" : "🔗 텍스트 링크로 편집"}
        </button>
      </div>

      {showManual ? (
        <div className="space-y-2">
          {urls.map((u, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#c10002]"
                value={u}
                onChange={e => onChange(urls.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="https://… 또는 /shop/…"
              />
              <button
                type="button"
                onClick={() => onChange(urls.filter((_, j) => j !== i))}
                className="px-3 bg-red-700 hover:bg-red-600 rounded text-white"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange([...urls, ""])}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs rounded text-white"
          >
            + 링크 추가
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {validUrls.map((url, idx) => (
            <div key={url + idx} className="relative aspect-[4/5] rounded-lg border border-white/20 overflow-hidden group">
              <Image src={url} alt={`Gallery item ${idx + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                <button
                  type="button"
                  onClick={() => onChange(urls.filter(u => u !== url))}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs transition"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}

          {/* Upload card in grid */}
          <label className="aspect-[4/5] border border-dashed border-white/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#c10002]/50 hover:bg-white/5 transition p-2 bg-black/20 text-center">
            {uploading ? (
              <span className="flex flex-col items-center justify-center gap-2 text-[11px] text-white/60">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                업로드 중...
              </span>
            ) : (
              <>
                <span className="text-xl mb-1 text-white/50">+</span>
                <span className="text-[11px] text-white/50">모델 피팅컷 추가</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={onUpload}
            />
          </label>
        </div>
      )}
    </div>
  )
}
