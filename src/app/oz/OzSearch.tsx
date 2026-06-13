"use client"

import React, {useState, useMemo} from "react"
import {type Prompt} from "@/data/prompts-data"
import Link from "next/link"

// /oz 작업실 아이템 = 프롬프트 + 상품 상태(draft/active)
export type OzItem = Prompt & {
  status?: "draft" | "active"
  slug?: string
}

export default function OzSearch({prompts}: {prompts: OzItem[]}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null)

  // 이미지 업로드 → publish API. mode: publish(draft 공개) | replace(교체) | add(갤러리 추가)
  const handlePublish = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slug: string,
    mode: "publish" | "replace" | "add" = "publish"
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = "" // 같은 파일 재선택 허용
    setUploadingSlug(slug)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("slug", slug)
      fd.append("mode", mode)
      const res = await fetch("/api/shop/publish", {method: "POST", body: fd})
      if (res.ok) {
        window.location.reload()
      } else {
        const j = await res.json().catch(() => ({}))
        alert(`등록 실패: ${j.error ?? res.status}`)
      }
    } catch {
      alert("등록 실패: 네트워크 오류")
    } finally {
      setUploadingSlug(null)
    }
  }

  // Search through title + full content + search tags
  const filteredPrompts = useMemo(() => {
    const sorted = [...prompts].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    if (!searchQuery.trim()) return sorted

    const query = searchQuery.toLowerCase()
    return sorted.filter(prompt =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.content.toLowerCase().includes(query) ||
      (prompt.searchText && prompt.searchText.toLowerCase().includes(query))
    )
  }, [searchQuery, prompts])

  const handleCopy = (e: React.MouseEvent, content: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1000)
  }

  return (
    <div className="w-full min-h-screen bg-[#111111] font-sans text-white antialiased">
      {/* Header — asterix */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.4em] text-white"
          >
            RAINSKISS
          </Link>
          <div className="text-xs uppercase tracking-[0.2em] text-white/40">
            Atelier
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-16 md:px-10">
        {/* 에디토리얼 타이틀 */}
        <div className="mb-12">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            — Prompt Engine
          </p>
          <h1
            className="font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{fontSize: "clamp(2.5rem, 8vw, 6.5rem)"}}
          >
            The{" "}
            <span style={{color: "#c10002"}} className="font-serif font-normal italic">
              Atelier
            </span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PROMPTS"
            className="w-full border-b border-white/20 bg-transparent px-1 py-4 text-lg uppercase tracking-[0.1em] text-white placeholder-white/30 outline-none transition-colors focus:border-[#c10002]"
            autoFocus
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 text-white/60 text-sm">
          {searchQuery ? `${filteredPrompts.length} results for "${searchQuery}"` : `${filteredPrompts.length} total prompts`}
        </div>

        {/* Prompts List */}
        <div className="space-y-4">
          {filteredPrompts.map(prompt => (
            <div key={prompt.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#c10002] transition-colors duration-300">

              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Thumbnail */}
                  {prompt.images && prompt.images.length > 0 && (
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prompt.images[0]}
                        alt={prompt.title}
                        className="w-16 h-16 rounded-lg object-cover bg-white/10"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-white">{prompt.title}</h3>
                      {prompt.status === "draft" ? (
                        <label className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-sm rounded-lg flex-shrink-0 ml-4 whitespace-nowrap cursor-pointer transition-colors">
                          {uploadingSlug === prompt.slug ? "⏳ 등록중..." : "🔧 이미지 등록 → 공개"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingSlug === prompt.slug}
                            onChange={e => handlePublish(e, prompt.slug ?? prompt.id.replace("obsidian-", ""), "publish")}
                          />
                        </label>
                      ) : prompt.id.startsWith("obsidian-") ? (
                        <div className="flex flex-shrink-0 items-center gap-2 ml-4">
                          {uploadingSlug === prompt.slug && (
                            <span className="text-xs text-white/50">⏳ 업로드중...</span>
                          )}
                          <label className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-xs rounded-lg whitespace-nowrap transition-colors">
                            + 이미지
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingSlug === prompt.slug}
                              onChange={e => handlePublish(e, prompt.slug ?? prompt.id.replace("obsidian-", ""), "add")}
                            />
                          </label>
                          <label className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-xs rounded-lg whitespace-nowrap transition-colors">
                            교체
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingSlug === prompt.slug}
                              onChange={e => handlePublish(e, prompt.slug ?? prompt.id.replace("obsidian-", ""), "replace")}
                            />
                          </label>
                          <Link
                            href={`/shop/${prompt.slug ?? prompt.id.replace("obsidian-", "")}`}
                            className="px-4 py-2 bg-[#c10002] hover:bg-[#a00001] text-white text-sm rounded-lg transition-colors duration-200 whitespace-nowrap">
                            🔒 Shop
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={e => handleCopy(e, prompt.content, prompt.id)}
                          className="px-4 py-2 bg-[#c10002] hover:bg-[#a00001] text-white text-sm rounded-lg transition-colors duration-200 flex-shrink-0 ml-4">
                          {copiedId === prompt.id ? "✓ Copied!" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <pre className="whitespace-pre-wrap break-words text-sm text-white/90 leading-relaxed">
                    {prompt.content}
                  </pre>
                </div>

                {/* Search tags — static prompt만 (obsidian은 searchText가 본문 전체라 노출 금지) */}
                {!prompt.id.startsWith("obsidian-") && prompt.searchText && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prompt.searchText.split(' ').slice(0, 8).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date */}
                {prompt.createdAt && (
                  <div className="mt-3 text-xs text-white/40">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Images Gallery */}
              {prompt.images && prompt.images.length > 0 && (
                <div className="px-6 pb-6 border-t border-white/10 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {prompt.images.map((url, i) => (
                      <div key={i} className="rounded-lg overflow-hidden bg-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`${prompt.title} example ${i + 1}`}
                          className="w-full h-auto block hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && searchQuery && (
          <div className="text-center py-16 text-white/40">
            <p>No prompts found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
