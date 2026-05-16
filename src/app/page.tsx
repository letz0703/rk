"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { shopProducts, type Category } from "@/data/shop-products"

const categories: Category[] = ["Historical", "Street & Modern", "Fantasy & Armour"]

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")

  // URL 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `/?${queryString}` : "/"
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedCategory, router])

  // 초기 URL 파라미터 읽기
  useEffect(() => {
    const q = searchParams.get("q")
    const category = searchParams.get("category") as Category | null

    if (q) setSearchQuery(q)
    if (category && categories.includes(category)) setSelectedCategory(category)
  }, [searchParams])

  // 검색 및 필터링
  const filteredProducts = useMemo(() => {
    let filtered = shopProducts

    // 검색 필터링 (OR 방식, case-insensitive)
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/)
      filtered = filtered.filter(product => {
        const searchableText = `${product.title.en} ${product.description.en}`.toLowerCase()
        return searchTerms.some(term => searchableText.includes(term))
      })
    }

    // 카테고리 필터링
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    return filtered
  }, [searchQuery, selectedCategory])

  // 기본 표시용 (검색어 없을 때)
  const defaultProducts = shopProducts.slice(0, 6)

  const displayProducts = searchQuery.trim() || selectedCategory !== "all" ? filteredProducts : defaultProducts

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      {/* HERO 섹션 */}
      <div className="relative w-full h-screen">
        <Image
          src="/hero.jpg"
          alt="RAINSKISS AI Clothing Prompts"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-4">
            RAINSKISS
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-2 max-w-2xl">
            AI-generated costume & character prompts
          </p>
          <p className="text-lg text-white/70 mb-12">
            crafted for Grok & Flow
          </p>

          {/* 검색창 - 히어로 중앙에 큼직하게 배치 */}
          <div className="w-full max-w-xl mb-8">
            <input
              type="text"
              placeholder="Search for prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm"
              style={{ "--tw-ring-color": "#c10002" } as any}
            />
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <section className="px-6 py-8 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                selectedCategory === "all"
                  ? "bg-[#c10002] text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#c10002] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
            {/* R-rated 카테고리는 외부 링크 */}
            <Link
              href="https://deviantart.com/rainskiss-x"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition relative"
            >
              <span className="mr-2">Lingerie & Intimate</span>
              <span className="text-xs bg-[#c10002] px-1 py-0.5 rounded text-white">18+</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 검색 결과 / 기본 프롬프트 섹션 */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            {searchQuery.trim() ? "Search Results" : "Featured Prompts"}
          </h2>
          <p className="text-white/60 text-lg mb-4">
            Professional-grade prompts tested and verified
          </p>
          {(searchQuery.trim() || selectedCategory !== "all") && (
            <p className="text-white/40 text-sm">
              {displayProducts.length} prompts found
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
          )}
        </div>

        {/* 상품 그리드 */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
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
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight mb-1">
                      {product.title.en}
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      {product.tagline.en}
                    </p>
                  </div>
                  <div className="absolute top-6 right-6">
                    <span
                      className="bg-[#c10002] text-white font-bold px-3 py-1 rounded-full text-sm"
                    >
                      {product.price}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Get Prompt</span>
                    <span className="text-[#c10002] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-white/20 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white/60 mb-2">No prompts found</h3>
            <p className="text-white/40 text-sm">
              Try adjusting your search or browse all categories
            </p>
          </div>
        )}

        {/* 더 보기 링크 (기본 상태일 때만) */}
        {!searchQuery.trim() && selectedCategory === "all" && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition"
            >
              Browse All Prompts
              <span>→</span>
            </Link>
          </div>
        )}
      </section>

      {/* 이메일 수집 섹션 */}
      <section className="bg-white/5 border-t border-white/10 px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
            New drops, exclusive prompts
          </h2>
          <p className="text-white/60 mb-8">
            Join the list and never miss a collection launch
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#c10002] focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-[#c10002] hover:bg-[#a00002] text-white font-bold px-6 py-3 rounded-xl transition duration-300"
            >
              Subscribe
            </button>
          </div>

          <p className="text-white/40 text-xs mt-4">
            No spam, unsubscribe anytime. New collections weekly.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/40 text-sm">
            © 2025 RAINSKISS · AI Clothing Prompts · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}