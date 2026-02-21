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

  const fetchPrompts = useCallback(async () => {
    const snapshot = await get(ref(database, "prompts"))
    if (snapshot.exists()) {
      const data = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value
      }))
      setPrompts(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)))
    } else {
      setPrompts([])
    }
  }, [])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

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

  const exactMatch = useMemo(() => {
    return prompts.some(p => p.content?.trim() === query.trim())
  }, [prompts, query])

  const handleSave = async () => {
    if (!query.trim()) return
    if (exactMatch) return alert("Already exists")

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

  const handleCopy = (e: any, content: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1000)
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      <div className="w-full px-8 py-10">
        {/* TEXTAREA */}
        <textarea
          placeholder="Search or paste your full prompt here..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full h-64 p-6 bg-slate-800 border border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
        />

        {/* BUTTONS */}
        <div className="flex gap-4 mb-10 min-h-[48px]">
          {!selected && !exactMatch && (
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
            </>
          )}
        </div>

        <hr className="border-slate-700 mb-10" />

        {/* RESULTS */}
        <div className="w-full space-y-6 min-h-[300px]">
          {results.map(prompt => (
            <div
              key={prompt.id}
              onClick={() => {
                setSelected(prompt)
                setQuery(prompt.content)
              }}
              className="w-full p-6 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 transition cursor-pointer"
            >
              <h3 className="font-semibold mb-4">{prompt.title}</h3>

              <pre className="whitespace-pre-wrap break-words text-xs text-slate-300 mb-4">
                {prompt.content}
              </pre>

              <button
                onClick={e => handleCopy(e, prompt.content, prompt.id)}
                className="px-3 py-1 bg-blue-600 rounded-md text-xs"
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
