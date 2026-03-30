"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "@/lib/icons"
import { cn } from "@/lib/utils"
import type { GalleryEntry } from "./LookbookClient"

interface Props {
  entries: GalleryEntry[]
  modelName: string
}

export default function LookbookGallery({ entries, modelName }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = () =>
    setLightbox(i => (i === null ? null : (i - 1 + entries.length) % entries.length))
  const next = () =>
    setLightbox(i => (i === null ? null : (i + 1) % entries.length))

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded text-muted-foreground gap-2">
        <ZoomIn className="w-8 h-8 opacity-30" />
        <p className="text-sm">No photos yet — check back soon.</p>
      </div>
    )
  }

  return (
    <>
      {/* Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 space-y-2">
        {entries.map((entry, i) => (
          <div key={entry.id} className="break-inside-avoid space-y-1">
            {/* Thumbnail */}
            <button
              onClick={() => setLightbox(i)}
              className={cn(
                "relative block w-full overflow-hidden rounded group",
                "ring-0 hover:ring-1 hover:ring-primary transition-all duration-200"
              )}
            >
              <Image
                src={entry.imageUrl}
                alt={`${modelName} lookbook ${i + 1}`}
                width={400}
                height={500}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
              </div>
            </button>

            {/* Link below thumbnail */}
            {entry.linkUrl && (
              <a
                href={entry.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "block w-full px-1 text-xs text-muted-foreground/60 hover:text-primary",
                  "truncate transition-colors leading-tight"
                )}
                title={entry.linkUrl}
              >
                ↗ {new URL(entry.linkUrl).hostname.replace("www.", "")}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-7 h-7" />
          </button>

          {entries.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-primary transition-colors"
                onClick={e => { e.stopPropagation(); prev() }}
              >
                <ChevronLeft className="w-9 h-9" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-primary transition-colors"
                onClick={e => { e.stopPropagation(); next() }}
              >
                <ChevronRight className="w-9 h-9" />
              </button>
            </>
          )}

          <div
            className="relative max-w-3xl max-h-[90vh] mx-16 flex flex-col items-center gap-3"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={entries[lightbox].imageUrl}
              alt={`${modelName} ${lightbox + 1}`}
              width={900}
              height={1100}
              className="max-h-[80vh] w-auto object-contain rounded"
              unoptimized
            />

            {/* Link in lightbox */}
            <div className="flex items-center gap-3">
              <p className="text-white/30 text-xs">{lightbox + 1} / {entries.length}</p>
              {entries[lightbox].linkUrl && (
                <a
                  href={entries[lightbox].linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                >
                  ↗ 원본 링크 열기
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
