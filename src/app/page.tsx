"use client"

import {useState, useEffect, useMemo, Suspense} from "react"
import Image from "next/image"
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import {shopProducts, type Category} from "@/data/shop-products"

const categories: Category[] = [
  "Historical",
  "Street & Modern",
  "Fantasy & Armour"
]

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  )

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set("q", searchQuery.trim())
    if (selectedCategory !== "all") params.set("category", selectedCategory)
    const qs = params.toString()
    router.replace(qs ? `/?${qs}` : "/", {scroll: false})
  }, [searchQuery, selectedCategory, router])

  // URL 파라미터 변경 시 상태 동기화 (뒤로가기 등 대응)
  useEffect(() => {
    const q = searchParams.get("q")
    const category = searchParams.get("category") as Category | null
    if (q !== null && q !== searchQuery) setSearchQuery(q)
    if (
      category &&
      categories.includes(category) &&
      category !== selectedCategory
    )
      setSelectedCategory(category)
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    let filtered = shopProducts
    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().trim().split(/\s+/)
      filtered = filtered.filter(p => {
        const text = `${p.title.en} ${p.description.en}`.toLowerCase()
        return terms.some(t => text.includes(t))
      })
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    return filtered
  }, [searchQuery, selectedCategory])

  const hasQuery = searchQuery.trim() !== "" || selectedCategory !== "all"
  const displayProducts = hasQuery ? filteredProducts : []

  const featuredProducts = shopProducts.slice(0, 4)

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen flex flex-col">
      {/* 상단 검색 헤더 */}
      <header className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-6">
          <Link
            href="/"
            className="shrink-0 text-xl font-black tracking-tight text-white"
          >
            RAINSKISS
          </Link>
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#c10002] focus:border-transparent text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="max-w-4xl mx-auto px-6 pb-3 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              selectedCategory === "all"
                ? "bg-[#c10002] text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-[#c10002] text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
          <Link
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/60 hover:bg-white/20 transition flex items-center gap-1.5"
          >
            Lingerie & Intimate
            <span className="text-[10px] bg-[#c10002] px-1 py-0.5 rounded text-white leading-none">
              18+
            </span>
          </Link>
        </div>
      </header>

      {/* 검색 결과 영역 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {!hasQuery ? (
          <div className="py-16 text-center">
            <p className="text-white/20 text-sm">
              Search for costume, armour, fantasy, street style...
            </p>
          </div>
        ) : (
          <>
            <p className="text-white/40 text-sm mb-6">
              {displayProducts.length} result
              {displayProducts.length !== 1 ? "s" : ""}
              {searchQuery.trim() && (
                <>
                  {" "}
                  for{" "}
                  <span className="text-white/60">
                    &quot;{searchQuery.trim()}&quot;
                  </span>
                </>
              )}
              {selectedCategory !== "all" && ` · ${selectedCategory}`}
            </p>

            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProducts.map(product => (
                  <Link
                    key={product.slug}
                    href={`/shop/${product.slug}`}
                    className="group bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl overflow-hidden transition duration-300"
                  >
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={product.previewImage}
                        alt={product.title.en}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/80 mb-1 inline-block">
                          {product.category}
                        </span>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {product.title.en}
                        </h3>
                        <p className="text-white/70 text-xs mt-0.5">
                          {product.tagline.en}
                        </p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-[#c10002] text-white font-bold px-2.5 py-1 rounded-full text-xs">
                          {product.price}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-white/70 text-sm">Get Prompt</span>
                      <span className="text-[#c10002] group-hover:translate-x-1 transition-transform text-sm">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-white/30 text-base mb-2">No results found</p>
                <p className="text-white/20 text-sm">Try a different keyword</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* 히어로 섹션 — footer 위 브랜딩 영역 */}
      <section className="border-t border-white/10 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex flex-col sm:flex-row gap-12 items-start">
            {/* 좌측 카피 */}
            <div className="flex-1">
              <p className="text-[#c10002] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Primal Renaissance · Power Dynamic
              </p>
              <h2 className="text-4xl font-black tracking-tight leading-none mb-5">
                AI Costume
                <br />
                <span className="text-white/30">&amp; Character</span>
                <br />
                Prompts
              </h2>
              <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-8">
                Precision-engineered prompts for historical armour, fantasy
                figures, and street style — ready for Midjourney, Flux, and
                beyond.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-[#c10002] hover:bg-[#a00001] text-white text-sm font-semibold rounded-xl transition"
                >
                  Browse All Prompts →
                </Link>
                <Link
                  href="https://deviantart.com/rainskiss-x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white/70 text-sm font-medium rounded-xl transition"
                >
                  DeviantArt
                </Link>
              </div>
            </div>

            {/* 우측 피처드 그리드 */}
            <div className="w-full sm:w-64 shrink-0">
              <p className="text-white/20 text-xs font-medium tracking-widest uppercase mb-3">
                Featured
              </p>
              <div className="grid grid-cols-2 gap-2">
                {featuredProducts.map(product => (
                  <Link
                    key={product.slug}
                    href={`/shop/${product.slug}`}
                    className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5"
                  >
                    <Image
                      src={product.previewImage}
                      alt={product.title.en}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5">
                      <p className="text-white text-[10px] font-semibold leading-tight line-clamp-1">
                        {product.title.en}
                      </p>
                      <p className="text-[#c10002] text-[10px] font-bold">
                        {product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/20 text-xs">
            © 2025 RAINSKISS · AI Clothing Prompts
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-white/20 text-sm">
          Loading Search Engine...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
