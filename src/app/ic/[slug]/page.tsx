"use client"

import {useEffect, useState} from "react"
import {useParams} from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {ExternalLink, Pencil, X, Save} from "lucide-react"
import {getProductBySlug} from "@/data/ic-brands"
import {useAuthContext} from "@/components/context/AuthContext"
import {saveIcArticle, onIcArticle} from "@/api/firebase"

type Article = {
  title?: string
  body?: string
  updatedAt?: number
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

export default function ICProductPage() {
  const params = useParams()
  const slug = String(params.slug)
  const {isAdmin} = useAuthContext()

  const hit = getProductBySlug(slug)

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftBody, setDraftBody] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!hit) {
      setLoading(false)
      return
    }
    const unsub = onIcArticle(slug, data => {
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
          href="/ic"
          className="text-[10px] font-black uppercase tracking-widest text-[#c10002]"
        >
          ← 가격표로
        </Link>
      </div>
    )
  }

  const {brand, product} = hit

  function startEdit() {
    setDraftTitle(article?.title || product.name)
    setDraftBody(article?.body || "")
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveIcArticle(slug, {title: draftTitle, body: draftBody})
      setEditing(false)
    } catch (e) {
      alert("저장 실패: " + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const hasContent = !!article?.body?.trim()
  const displayTitle = article?.title || product.name

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 헤더 */}
      <div className="px-6 pt-14 pb-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/ic"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition mb-8"
          >
            ← 깡통시장 가격표
          </Link>

          <div className="flex gap-5 items-start">
            <div className="relative w-28 h-36 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={brand.imageUrl || brand.image}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
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
                  className="inline-flex items-center gap-1 mt-3 text-[11px] text-gray-400 hover:text-gray-700 transition"
                >
                  공식 홈페이지 <ExternalLink size={11} />
                </a>
              )}
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
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {article!.body!}
              </ReactMarkdown>
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
        </div>
      </div>
    </div>
  )
}
