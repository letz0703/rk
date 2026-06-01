"use client"

import React, {useState, useMemo} from "react"
import {promptsData, type Prompt} from "@/data/prompts-data"
import Link from "next/link"

export default function OzPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Fuzzy search through prompts
  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) {
      return promptsData.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    }

    const query = searchQuery.toLowerCase()
    return promptsData.filter(prompt =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.content.toLowerCase().includes(query) ||
      (prompt.searchText && prompt.searchText.toLowerCase().includes(query))
    ).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }, [searchQuery])

  const handleCopy = (e: React.MouseEvent, content: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1000)
  }

  return (
    <div className="w-full min-h-screen bg-[#0e0e0e] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tight text-white">
            RAINSKISS
          </Link>
          <div className="text-white/60 text-sm">
            Prompt Engine
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#c10002] text-lg"
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
                      <button
                        onClick={e => handleCopy(e, prompt.content, prompt.id)}
                        className="px-4 py-2 bg-[#c10002] hover:bg-[#a00001] text-white text-sm rounded-lg transition-colors duration-200 flex-shrink-0 ml-4">
                        {copiedId === prompt.id ? "✓ Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <pre className="whitespace-pre-wrap break-words text-sm text-white/90 leading-relaxed">
                    {prompt.content}
                  </pre>
                </div>

                {/* Search tags */}
                {prompt.searchText && (
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