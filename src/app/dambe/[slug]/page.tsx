"use client"

import {useEffect, useRef, useState} from "react"
import {useParams} from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ExternalLink,
  Pencil,
  X,
  Save,
  Upload,
  Loader2,
  Check
} from "lucide-react"
import {getProductBySlug, productSlug} from "@/data/dambe-brands"
import {useAuthContext} from "@/components/context/AuthContext"
import {saveDambeArticle, onDambeArticle} from "@/api/firebase"
import {
  fbSubscribeBrands,
  fbUploadBrandImage,
  fbUpdateProductImage
} from "@/api/dambeFirebase"
import type {Brand} from "@/data/dambe-brands"

type Article = {
  title?: string
  body?: string
  videoUrl?: string
  updatedAt?: number
}

// YouTube URL → embed ID (youtu.be / watch?v= / shorts / embed 지원). 못 찾으면 null.
function youtubeId(url: string | undefined | null): string | null {
  if (!url) return null
  const m = url
    .trim()
    .match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
    )
  return m ? m[1] : null
}

// 마크다운 요소별 스타일 (tailwind preflight가 기본 마진/크기 리셋하므로 직접 지정)
const mdComponents = {
  h1: (p: any) => (
    <h1 className="text-2xl font-black text-gray-900 mt-8 mb-3" {...p} />
  ),
  h2: (p: any) => (
    <h2 className="text-xl font-black text-gray-900 mt-7 mb-3" {...p} />
  ),
  h3: (p: any) => (
    <h3 className="text-base font-black text-gray-900 mt-5 mb-2" {...p} />
  ),
  p: (p: any) => (
    <p className="text-sm leading-7 text-gray-700 my-3" {...p} />
  ),
  ul: (p: any) => (
    <ul className="list-disc pl-5 my-3 space-y-1 text-sm text-gray-700" {...p} />
  ),
  ol: (p: any) => (
    <ol
      className="list-decimal pl-5 my-3 space-y-1 text-sm text-gray-700"
      {...p}
    />
  ),
  li: (p: any) => <li className="leading-7" {...p} />,
  a: (p: any) => (
    <a
      className="text-[#c10002] underline underline-offset-2 hover:opacity-70"
      target="_blank"
      rel="noopener noreferrer"
      {...p}
    />
  ),
  strong: (p: any) => <strong className="font-black text-gray-900" {...p} />,
  blockquote: (p: any) => (
    <blockquote
      className="border-l-2 border-[#c10002] pl-4 my-4 text-sm text-gray-500 italic"
      {...p}
    />
  ),
  hr: () => <hr className="my-6 border-gray-100" />,
  code: (p: any) => (
    <code
      className="bg-gray-100 text-[#c10002] px-1.5 py-0.5 rounded text-xs font-mono"
      {...p}
    />
  ),
  img: (p: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-xl my-4 w-full" alt={p.alt || ""} {...p} />
  ),
  table: (p: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse" {...p} />
    </div>
  ),
  th: (p: any) => (
    <th
      className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-black text-gray-700"
      {...p}
    />
  ),
  td: (p: any) => (
    <td className="border border-gray-200 px-3 py-2 text-gray-700" {...p} />
  )
}

export default function DambeProductPage() {
  const params = useParams()
  const slug = String(params.slug)
  const {isAdmin} = useAuthContext()

  const hit = getProductBySlug(slug)

  const [overrides, setOverrides] = useState<Record<string, Brand>>({})
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  // Firebase override 구독 (가격·이미지 실시간 반영)
  useEffect(() => {
    const off = fbSubscribeBrands(setOverrides)
    return () => off()
  }, [])
  const [editing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftBody, setDraftBody] = useState("")
  const [draftVideo, setDraftVideo] = useState("")
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (!hit) {
      setLoading(false)
      return
    }
    const unsub = onDambeArticle(slug, (data: Article | null) => {
      setArticle(data)
      setLoading(false)
    })
    return () => unsub()
  }, [slug, hit])

  if (!hit) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-6">
        <p className="text-sm text-gray-500 mb-4">제품을 찾을 수 없습니다.</p>
        <Link
          href="/dambe"
          className="text-[10px] font-black uppercase tracking-widest text-[#c10002]"
        >
          ← 가격표로
        </Link>
      </div>
    )
  }

  // 정적 hit + Firebase override 병합 → 가격·이미지 최신 반영
  const brand = overrides[hit.brand.id] ?? hit.brand
  const product = brand.products[hit.index] ?? hit.product
  // 제품 이미지 우선, 없으면 브랜드 대표이미지 (없을 수 있음)
  const heroImage = product.image || brand.imageUrl || brand.image || ""
  // 같은 브랜드 다른 상품 (현재 상품 제외)
  const siblings = brand.products
    .map((p, i) => ({p, i}))
    .filter(({i}) => i !== hit.index)

  async function handleImageFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return
    setUploading(true)
    try {
      const url = await fbUploadBrandImage(slug, file)
      await fbUpdateProductImage(brand, hit!.index, url)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 1500)
    } catch (e) {
      alert("이미지 업로드 실패: " + (e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  function startEdit() {
    setDraftTitle(article?.title || product.name)
    setDraftBody(article?.body || "")
    setDraftVideo(article?.videoUrl || "")
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveDambeArticle(slug, {
        title: draftTitle,
        body: draftBody,
        videoUrl: draftVideo.trim()
      })
      setEditing(false)
    } catch (e) {
      alert("저장 실패: " + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  // 유튜브칸 우선, 없으면 본문에서 자동 탐지
  const videoId = youtubeId(article?.videoUrl) || youtubeId(article?.body)
  // 본문에서 단독 유튜브 URL 줄 제거 (영상으로 임베드되므로 중복 방지)
  const bodyWithoutVideo = (article?.body || "")
    .split("\n")
    .filter(line => !youtubeId(line.trim()) || line.trim().length > 60)
    .join("\n")
    .trim()
  const hasContent = !!bodyWithoutVideo || !!videoId
  const displayTitle = article?.title || product.name

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 헤더 */}
      <div className="px-6 pt-14 pb-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dambe"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition mb-8"
          >
            ← 담배 가격표
          </Link>

          <div className="flex gap-5 items-start">
            <div
              className={`group relative w-28 h-36 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 ${
                isAdmin ? "cursor-pointer" : ""
              }`}
              onClick={() => isAdmin && fileInputRef.current?.click()}
              onDragOver={e => isAdmin && e.preventDefault()}
              onDrop={e => {
                if (!isAdmin) return
                e.preventDefault()
                handleImageFile(e.dataTransfer.files[0])
              }}
            >
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center px-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                    {brand.name}
                  </span>
                </div>
              )}
              {/* admin: 이미지 업로드 오버레이 */}
              {isAdmin && (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-white transition-opacity ${
                    uploading || justSaved
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {uploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : justSaved ? (
                    <Check size={20} />
                  ) : (
                    <>
                      <Upload size={18} />
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        사진 등록
                      </span>
                    </>
                  )}
                </div>
              )}
              {isAdmin && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageFile(e.target.files?.[0])}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c10002] mb-2">
                {brand.category} · {brand.name}
              </p>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight mb-2">
                {displayTitle}
              </h1>
              {product.price !== null ? (
                <p className="text-lg font-black text-[#c10002]">
                  ₩{product.price.toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-gray-400">가격 문의</p>
              )}
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-[11px] text-gray-400 hover:text-gray-700 transition"
                >
                  <span className="inline-flex items-center gap-1">
                    공식 홈페이지 <ExternalLink size={11} />
                  </span>
                </a>
              )}
              {/* 담배는 대면판매만 (담배사업법 §13의2). 온라인 주문·결제 미지원 */}
              <p className="mt-4 text-[11px] text-gray-400 leading-5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                🏬 매장 방문 대면 구매만 가능 · 온라인 판매/결제 미지원
              </p>
            </div>

            {isAdmin && !editing && (
              <button
                onClick={startEdit}
                className="shrink-0 inline-flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-black px-3 py-2 rounded-full transition"
              >
                <Pencil size={12} />
                {hasContent ? "수정" : "글쓰기"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
                placeholder="제목"
                className="w-full text-xl font-black bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#c10002] transition-colors"
              />
              {/* 유튜브 영상 링크 */}
              <div>
                <input
                  type="text"
                  value={draftVideo}
                  onChange={e => setDraftVideo(e.target.value)}
                  placeholder="유튜브 링크 붙여넣기 (예: https://youtu.be/A4-5a81ms-Y)"
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#c10002] transition-colors"
                />
                {draftVideo.trim() &&
                  (youtubeId(draftVideo) ? (
                    <div className="relative w-full aspect-video mt-2 rounded-xl overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId(draftVideo)}`}
                        title="미리보기"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#c10002] mt-1">
                      ⚠ 유튜브 링크 형식이 아니에요
                    </p>
                  ))}
              </div>
              <textarea
                value={draftBody}
                onChange={e => setDraftBody(e.target.value)}
                placeholder="본문 (마크다운 지원: # 제목, **굵게**, - 목록, > 인용, | 표 |, [링크](url))"
                rows={20}
                className="w-full text-sm leading-7 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-[#c10002] transition-colors resize-y"
              />

              {/* 라이브 미리보기 */}
              {draftBody.trim() && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    미리보기
                  </p>
                  <div className="border border-gray-100 rounded-xl p-5 bg-white">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={mdComponents}
                    >
                      {draftBody}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 bg-[#c10002] hover:bg-[#a00001] disabled:opacity-50 text-white text-sm font-black px-5 py-2.5 rounded-full transition"
                >
                  <Save size={14} />
                  {saving ? "저장 중…" : "저장"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-black px-5 py-2.5 rounded-full transition"
                >
                  <X size={14} />
                  취소
                </button>
              </div>
            </div>
          ) : loading ? (
            <p className="text-sm text-gray-400">불러오는 중…</p>
          ) : hasContent ? (
            <article>
              {/* 유튜브 영상 */}
              {videoId && (
                <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={displayTitle}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {bodyWithoutVideo && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={mdComponents}
                >
                  {bodyWithoutVideo}
                </ReactMarkdown>
              )}
              {article?.updatedAt && (
                <p className="text-[11px] text-gray-300 mt-10 pt-4 border-t border-gray-100">
                  마지막 수정:{" "}
                  {new Date(article.updatedAt).toLocaleDateString("ko-KR")}
                </p>
              )}
            </article>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-gray-400">
                아직 작성된 내용이 없습니다.
              </p>
              {isAdmin && (
                <button
                  onClick={startEdit}
                  className="mt-4 inline-flex items-center gap-1.5 text-[#c10002] text-sm font-black"
                >
                  <Pencil size={13} /> 첫 글 작성하기
                </button>
              )}
            </div>
          )}

          {/* 같은 브랜드 다른 상품 */}
          {!editing && siblings.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">
                {brand.name} 다른 상품
              </p>
              <div className="space-y-1">
                {siblings.map(({p, i}) => (
                  <Link
                    key={i}
                    href={`/dambe/${productSlug(brand.id, i)}`}
                    className="flex justify-between items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{p.name}</span>
                    {p.price !== null ? (
                      <span className="text-sm font-black text-[#c10002] shrink-0">
                        ₩{p.price.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400 shrink-0">문의</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
