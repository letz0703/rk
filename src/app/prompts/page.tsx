"use client"

import {useEffect, useState, useMemo, useCallback} from "react"
import {ref, get, push, update} from "firebase/database"
import {database} from "../../api/firebase"
import Fuse from "fuse.js"

export default function PromptSearchPage() {
  const [prompts, setPrompts] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<any | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  /* ---------------- FETCH ---------------- */
  const fetchPrompts = useCallback(async () => {
    const snapshot = await get(ref(database, "prompts"))
    if (snapshot.exists()) {
      const data = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value
      }))
      setPrompts(data.sort((a, b) => b.createdAt - a.createdAt))
    } else {
      setPrompts([])
    }
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  /* ---------------- SEARCH ENGINE ---------------- */
  const fuse = useMemo(() => {
    return new Fuse(prompts, {
      keys: ["title", "searchText", "content"],
      threshold: 0.3,
      ignoreLocation: true
    })
  }, [prompts])

  const results = useMemo(() => {
    if (!query.trim()) return prompts
    return fuse.search(query).map(r => r.item)
  }, [query, fuse, prompts])

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!query.trim()) return
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

  /* ---------------- UPDATE ---------------- */
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

  /* ---------------- CANCEL ---------------- */
  const handleCancel = () => {
    setSelected(null)
    setQuery("")
  }

  /* ---------------- COPY ---------------- */
  const handleCopy = (e: any, content: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1200)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center overflow-y-scroll">
      <div className="w-[1100px] px-10 py-12">
        {/* TEXTAREA (레이아웃 흔들림 방지 설정) */}
        <textarea
          placeholder="Search or paste your full prompt here..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={12}
          className="
            w-full
            p-6
            text-sm
            bg-slate-800
            border border-slate-700
            rounded-xl
            resize-none
            overflow-y-scroll
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            transition-none
            mb-6
          "
        />

        {/* BUTTONS */}
        <div className="flex gap-4 mb-8">
          {query && results.length === 0 && !selected && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
            >
              {isSaving ? "Saving..." : "Save as New Prompt"}
            </button>
          )}

          {selected && (
            <>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-md transition"
              >
                {isSaving ? "Updating..." : "Update Prompt"}
              </button>

              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 rounded-md transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        <hr className="border-slate-700 mb-10" />

        {/* RESULTS */}
        <div className="space-y-8">
          {results.map(prompt => (
            <div
              key={prompt.id}
              onClick={() => {
                setSelected(prompt)
                setQuery(prompt.content)
              }}
              className="
                p-6
                bg-slate-800
                border border-slate-700
                rounded-xl
                cursor-pointer
                hover:border-blue-500
                transition
              "
            >
              <h3 className="text-lg font-semibold mb-3 truncate">
                {prompt.title}
              </h3>

              <pre className="whitespace-pre-wrap text-xs text-slate-300 mb-4">
                {prompt.content}
              </pre>

              <button
                onClick={e => handleCopy(e, prompt.content, prompt.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-xs transition"
              >
                {copiedId === prompt.id ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
