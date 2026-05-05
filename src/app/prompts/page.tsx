"use client"

import React, {useEffect, useState, useMemo, useCallback} from "react"
import {ref, get, push, update} from "firebase/database"
import {database} from "../../api/firebase"
import {useAuthContext} from "@/components/context/AuthContext"
import Fuse from "fuse.js"

const ADMIN_EMAIL = "rainskiss@gmail.com"

type Prompt = {
  id: string
  title: string
  content: string
  searchText: string
  images?: string[]
  createdAt?: number
  updatedAt?: number
}

export default function PromptSearchPage() {
  const {user} = useAuthContext()
  const isAdmin = user?.email === ADMIN_EMAIL

  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Prompt | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [imageInput, setImageInput] = useState("")
  const [imageTarget, setImageTarget] = useState<string | null>(null)

  const fetchPrompts = useCallback(async () => {
    const snapshot = await get(ref(database, "prompts"))
    if (snapshot.exists()) {
      const data = Object.entries(snapshot.val() as Record<string, Omit<Prompt, "id">>).map(([key, value]) => ({
        id: key,
        ...value
      }))
      setPrompts(data.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)))
    } else {
      setPrompts([])
    }
  }, [])

  useEffect(() => { fetchPrompts() }, [fetchPrompts])

  const fuse = useMemo(() => new Fuse(prompts, {
    keys: ["title", "searchText", "content"],
    threshold: 0.3,
    ignoreLocation: true
  }), [prompts])

  const results = useMemo(() => {
    if (!query.trim()) return prompts
    return fuse.search(query).map(r => r.item)
  }, [query, fuse, prompts])

  const exactMatch = useMemo(() =>
    prompts.some(p => p.content?.trim() === query.trim()),
  [prompts, query])

  const handleSave = async () => {
    if (!query.trim() || exactMatch) return
    setIsSaving(true)
    await push(ref(database, "prompts"), {
      title: query.slice(0, 60),
      content: query,
      searchText: query.toLowerCase(),
      createdAt: Date.now()
    })
    await fetchPrompts()
    setQuery("")
    setIsSaving(false)
  }

  const handleUpdate = async () => {
    if (!selected) return
    setIsSaving(true)
    await update(ref(database, `prompts/${selected.id}`), {
      content: query,
      searchText: query.toLowerCase(),
      updatedAt: Date.now()
    })
    await fetchPrompts()
    setSelected(null)
    setQuery("")
    setIsSaving(false)
  }

  const handleCopy = (e: React.MouseEvent, content: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1000)
  }

  const handleAddImage = async (promptId: string) => {
    const url = imageInput.trim()
    if (!url) return
    const prompt = prompts.find(p => p.id === promptId)
    if (!prompt) return
    const next = [...(prompt.images ?? []), url]
    await update(ref(database, `prompts/${promptId}`), {images: next})
    setPrompts(ps => ps.map(p => p.id === promptId ? {...p, images: next} : p))
    setImageInput("")
    setImageTarget(null)
  }

  const handleRemoveImage = async (promptId: string, url: string) => {
    const prompt = prompts.find(p => p.id === promptId)
    if (!prompt) return
    const next = (prompt.images ?? []).filter(u => u !== url)
    await update(ref(database, `prompts/${promptId}`), {images: next})
    setPrompts(ps => ps.map(p => p.id === promptId ? {...p, images: next} : p))
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      <div className="w-full px-8 py-10">
        <textarea
          placeholder="Search or paste your full prompt here..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full h-64 p-6 bg-slate-800 border border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
        />

        <div className="flex gap-4 mb-10 min-h-[48px]">
          {!selected && !exactMatch && (
            <button onClick={handleSave} disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition">
              {isSaving ? "Saving..." : "Save as New Prompt"}
            </button>
          )}
          {selected && (
            <button onClick={handleUpdate} disabled={isSaving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md transition">
              {isSaving ? "Updating..." : "Update Prompt"}
            </button>
          )}
        </div>

        <hr className="border-slate-700 mb-10" />

        <div className="w-full space-y-8">
          {results.map(prompt => (
            <div key={prompt.id}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition">

              {/* 프롬프트 텍스트 영역 */}
              <div className="p-6 cursor-pointer"
                onClick={() => { setSelected(prompt); setQuery(prompt.content) }}>
                <h3 className="font-semibold mb-4">{prompt.title}</h3>
                <pre className="whitespace-pre-wrap break-words text-xs text-slate-300 mb-4">
                  {prompt.content}
                </pre>
                <div className="flex items-center gap-3">
                  <button onClick={e => handleCopy(e, prompt.content, prompt.id)}
                    className="px-3 py-1 bg-blue-600 rounded-md text-xs">
                    {copiedId === prompt.id ? "Copied!" : "Copy"}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); setImageTarget(imageTarget === prompt.id ? null : prompt.id); setImageInput("") }}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-xs text-slate-300 transition">
                      {imageTarget === prompt.id ? "닫기" : "+ 이미지 추가"}
                    </button>
                  )}
                </div>
              </div>

              {/* 어드민: 이미지 URL 입력 */}
              {isAdmin && imageTarget === prompt.id && (
                <div className="px-6 pb-4 flex gap-2 border-t border-slate-700 pt-4">
                  <input
                    value={imageInput}
                    onChange={e => setImageInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAddImage(prompt.id) }}
                    placeholder="이미지 URL 붙여넣기 후 Enter"
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button onClick={() => handleAddImage(prompt.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition">
                    추가
                  </button>
                </div>
              )}

              {/* 이미지 갤러리 */}
              {prompt.images && prompt.images.length > 0 && (
                <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3">
                    {prompt.images.map((url, i) => (
                      <div key={i} className="group relative break-inside-avoid rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-auto block" />
                        {isAdmin && (
                          <button
                            onClick={() => handleRemoveImage(prompt.id, url)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white/70 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition">
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
