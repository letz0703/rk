"use client"

import {useState, useEffect, useMemo} from "react"
import Link from "next/link"
import Image from "next/image"
import {useRouter, useSearchParams} from "next/navigation"
import {
  shopProducts,
  type Category,
  type ShopProduct
} from "@/data/shop-products"

const categories: Category[] = [
  "Mathematical Fashion",
  "Historical",
  "Street & Modern",
  "Fantasy & Armour"
]
const sortOptions = [
  {value: "newest", label: "최신순"},
  {value: "popular", label: "인기순"}
] as const

type SortOption = "newest" | "popular"

export default function ShopPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  )
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  // Password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState(false)

  const SHOP_PASSWORD = "oz" // Member access password

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === SHOP_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError(false)
      localStorage.setItem("rainskiss_shop_auth", "true")
    } else {
      setPasswordError(true)
      setTimeout(() => setPasswordError(false), 2000)
    }
  }

  // Check localStorage for previous auth
  useEffect(() => {
    const stored = localStorage.getItem("rainskiss_shop_auth")
    if (stored === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // URL 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory)
    }
    if (sortBy !== "newest") {
      params.set("sort", sortBy)
    }

    const queryString = params.toString()
    const newUrl = queryString ? `/shop?${queryString}` : "/shop"
    router.replace(newUrl, {scroll: false})
  }, [searchQuery, selectedCategory, sortBy, router])

  // 초기 URL 파라미터 읽기
  useEffect(() => {
    const q = searchParams.get("q")
    const category = searchParams.get("category") as Category | null
    const sort = searchParams.get("sort") as SortOption | null

    if (q) setSearchQuery(q)
    if (category && categories.includes(category)) setSelectedCategory(category)
    if (sort && (sort === "newest" || sort === "popular")) setSortBy(sort)
  }, [searchParams])

  // 검색 및 필터링
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = shopProducts

    // 검색 필터링 (AND 방식, 모든 검색어가 포함되어야 함)
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/)
      filtered = filtered.filter(product => {
        const searchableText =
          `${product.title.en} ${product.description.en}`.toLowerCase()
        return searchTerms.every(term => searchableText.includes(term))
      })
    }

    // 카테고리 필터링
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        product => product.category === selectedCategory
      )
    }

    // 정렬
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "popular") {
        // 인기순 (임시로 slug 기준 알파벳 순으로 정렬)
        return a.slug.localeCompare(b.slug)
      }
      // 최신순 (임시로 역순)
      return b.slug.localeCompare(a.slug)
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              THE 1.618 COLLECTION
            </h1>
            <p className="text-white/40 text-sm">
              Mathematical Fashion · Private Collection
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Access Code"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition text-center tracking-[0.3em] ${
                  passwordError ? 'focus:ring-red-500 border-red-500' : 'focus:ring-[#c10002]'
                }`}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-400 text-xs mt-2 text-center animate-pulse">
                  Invalid access code
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#c10002] hover:bg-[#a00001] text-white font-semibold rounded-xl transition tracking-wider"
            >
              ENTER
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/20 text-xs">
              Available on DeviantArt for authorized users
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">
            AI Clothing Prompt Store
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            RAINSKISS <span style={{color: "#c10002"}}>COLLECTION</span>
          </h1>
          <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed mb-8">
            Professional-grade prompts for Grok & Flow. Each prompt is tested
            and verified for consistent results.
          </p>
        </div>

        {/* 검색창 */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{"--tw-ring-color": "#c10002"} as React.CSSProperties}
            />
          </div>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === "all"
                  ? "bg-[#c10002] text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#c10002] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 정렬 */}
          <div className="flex gap-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                  sortBy === option.value
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 결과 개수 */}
        <div className="mb-6">
          <p className="text-white/40 text-sm">
            {filteredAndSortedProducts.length} prompts found
          </p>
        </div>

        {/* 상품 그리드 */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAndSortedProducts.map(product => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition duration-300"
              >
                <div className="relative w-full aspect-[4/5] bg-white/5">
                  <Image
                    src={product.previewImage}
                    alt={product.title.en}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/70">
                        {product.category}
                      </span>
                      <span className="text-xs text-white/40 uppercase tracking-wide">
                        Flow Preview
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white leading-tight mb-1">
                      {product.title.en}
                    </h2>
                    <p className="text-white/60 text-sm line-clamp-2">
                      {product.tagline.en}
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-white/40 text-sm">Get Prompt</span>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full text-white"
                    style={{backgroundColor: "#c10002"}}
                  >
                    {product.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-white/20 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white/60 mb-2">
              No prompts found
            </h3>
            <p className="text-white/40 text-sm">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        )}

        {/* 하단 링크 */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/30 mb-3">
            Free Flow previews available on
          </p>
          <a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition mb-6 inline-block"
          >
            DeviantArt / rainskiss-x ↗
          </a>
          <div>
            <Link
              href="/"
              className="text-xs text-white/20 hover:text-white/40 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* 이메일 수집 섹션 */}
      <section className="bg-white/5 border-t border-white/10 px-6 py-16">
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
    </div>
  )
}
