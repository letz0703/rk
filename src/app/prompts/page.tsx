"use client"

import React, {useState} from "react"
import {promptsData, type Prompt} from "@/data/prompts-data"

export default function PromptLibraryPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Sort prompts by creation date (newest first)
  const prompts = promptsData.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))

  const handleCopy = (e: React.MouseEvent, content: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1000)
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      <div className="w-full px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            RAINSKISS <span className="text-[#c10002]">Prompt Library</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Mathematical fashion prompts using φ golden ratio and sacred geometry
          </p>
        </div>

        {/* Prompts count */}
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <p className="text-slate-400">
            {prompts.length} Mathematical Fashion Prompts
          </p>
        </div>

        {/* Prompts List */}
        <div className="max-w-3xl mx-auto space-y-6">
          {prompts.map(prompt => (
            <div key={prompt.id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-[#c10002] transition-colors duration-300">

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-xl text-white">{prompt.title}</h3>
                  <button
                    onClick={e => handleCopy(e, prompt.content, prompt.id)}
                    className="px-4 py-2 bg-[#c10002] hover:bg-[#a00001] text-white text-sm rounded-lg transition-colors duration-200 flex-shrink-0 ml-4">
                    {copiedId === prompt.id ? "✓ Copied!" : "Copy Prompt"}
                  </button>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                  <pre className="whitespace-pre-wrap break-words text-sm text-slate-200 leading-relaxed">
                    {prompt.content}
                  </pre>
                </div>

                {/* Search tags */}
                {prompt.searchText && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prompt.searchText.split(' ').slice(0, 6).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date */}
                {prompt.createdAt && (
                  <div className="mt-3 text-xs text-slate-500">
                    Created: {new Date(prompt.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Images Gallery (if any) */}
              {prompt.images && prompt.images.length > 0 && (
                <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {prompt.images.map((url, i) => (
                      <div key={i} className="rounded-lg overflow-hidden bg-slate-700">
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


        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm">
            © 2026 RAINSKISS · Mathematical Fashion Prompts
          </p>
        </div>
      </div>
    </div>
  )
}