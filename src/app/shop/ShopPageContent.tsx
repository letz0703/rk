"use client"

import {useState, useEffect, useMemo} from "react"
import Link from "next/link"
import ProductCard from "./ProductCard"
import {useRouter, useSearchParams} from "next/navigation"
import {useAuthContext} from "@/components/context/AuthContext"
import {
  shopProducts,
  type Category,
  type ShopProduct
} from "@/data/shop-products"

const categories: Category[] = [
  "Street",
  "Uniform",
  "Swimwear",
  "Bodysuit",
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "Shoes",
  "Socks",
  "Background",
  "Accessories"
]
const sortOptions = [
  {value: "newest", label: "최신순"},
  {value: "popular", label: "인기순"}
] as const

type SortOption = "newest" | "popular"

export default function ShopPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {isAdmin} = useAuthContext()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  )
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  // 전체 상품(정적 + obsidian) 로드. 초기엔 정적만 즉시 표시 후 API로 갱신.
  const [allProducts, setAllProducts] = useState<ShopProduct[]>(shopProducts)
  useEffect(() => {
    fetch("/api/shop/products")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (Array.isArray(data)) setAllProducts(data)
      })
      .catch(() => {})
  }, [])

  // Delete product function
  const deleteProduct = (slug: string) => {
    if (confirm(`Delete product "${slug}"?`)) {
      // TODO: Remove from Firebase and update local state
      console.log("Delete product:", slug)
    }
  }

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
    // 공개 매대 = active만 (draft 작업중은 /oz 작업실에만 노출). status 없으면 active 취급.
    let filtered = allProducts.filter(p => (p.status ?? "active") === "active")

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
  }, [allProducts, searchQuery, selectedCategory, sortBy])


  return (
    <div className="min-h-screen bg-[#111111] font-sans text-white antialiased">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        {/* 헤더 — asterix 에디토리얼 */}
        <div className="mb-20">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            — AI Clothing Prompt Store
          </p>
          <h1
            className="font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{fontSize: "clamp(3rem, 9vw, 8rem)"}}
          >
            The{" "}
            <span style={{color: "#c10002"}} className="font-serif font-normal italic">
              Collection
            </span>
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-white/50">
            Grok &amp; Flow를 위한 검증된 프롬프트. 각 프롬프트는 일관된 결과를 위해
            테스트되었습니다.
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

        {/* 검색 결과 개수 & 상품 추가 */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-white/40 text-sm">
            {filteredAndSortedProducts.length} prompts found
          </p>
          {isAdmin && (
            <button
              onClick={() => {
                const title = prompt("상품 제목을 입력하세요:")
                if (title) {
                  // TODO: 상품 추가 로직
                  alert("상품 추가 기능은 준비 중입니다.")
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition"
            >
              + 상품 추가
            </button>
          )}
        </div>

        {/* 상품 그리드 */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAndSortedProducts.map(product => (
              <ProductCard
                key={product.slug}
                product={product}
                isAdmin={isAdmin}
                onDelete={deleteProduct}
              />
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

    </div>
  )
}
