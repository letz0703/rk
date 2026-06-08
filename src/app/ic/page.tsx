"use client"

import {useState} from "react"
import Link from "next/link"
import {ExternalLink, Search, X} from "lucide-react"
import {brands, productSlug, type Brand} from "@/data/ic-brands"

const CATEGORIES = [
  "전체",
  "싱글몰트",
  "블렌디드",
  "일본위스키",
  "코냑",
  "버번·테네시",
  "기타"
]

const CATEGORY_COLORS: Record<string, string> = {
  싱글몰트: "#3b82f6",
  블렌디드: "#f59e0b",
  일본위스키: "#ec4899",
  코냑: "#a78bfa",
  "버번·테네시": "#f97316",
  기타: "#6b7280"
}

function BrandCard({
  brand,
  onImageUpdate
}: {
  brand: Brand
  onImageUpdate: (brandId: string, imageUrl: string) => void
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const catColor = CATEGORY_COLORS[brand.category] ?? "#6b7280"

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith("image/")) return

    const imageUrl = URL.createObjectURL(file)
    onImageUpdate(brand.id, imageUrl)
  }

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
      {/* 썸네일 영역 */}
      <div
        className={`relative w-full aspect-[4/3] overflow-hidden bg-white/5 ${
          isDragOver ? "border-2 border-dashed border-[#c10002]" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 드래그 오버레이 */}
        {isDragOver && (
          <div className="absolute inset-0 bg-[#c10002]/20 flex items-center justify-center z-10">
            <span className="text-white text-sm font-black uppercase tracking-wider">
              이미지 드롭
            </span>
          </div>
        )}

        {!imgFailed && (brand.imageUrl || brand.image) ? (
          <img
            src={brand.imageUrl || brand.image}
            alt={brand.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${catColor}18, ${catColor}06)`
            }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
              {brand.name}
            </span>
          </div>
        )}
        {/* 카테고리 뱃지 */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
          style={{backgroundColor: catColor + "cc"}}
        >
          {brand.category}
        </span>
        {/* 홈페이지 링크 버튼 */}
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-black/50 backdrop-blur rounded-full p-1.5 text-white/70 hover:text-white transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
          {brand.name}
        </h3>
        <div className="border-t border-gray-100 mt-3 mb-3" />
        <div className="space-y-2">
          {brand.products.map((product, index) => (
            <Link
              key={index}
              href={`/ic/${productSlug(brand.id, index)}`}
              className="group/row flex justify-between items-center gap-2 -mx-1 px-1 py-0.5 rounded hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs text-gray-600 group-hover/row:text-gray-900 transition-colors truncate">
                {product.name}
              </span>
              {product.price !== null ? (
                <span className="text-xs font-black text-[#c10002] shrink-0">
                  ₩{product.price.toLocaleString()}
                </span>
              ) : (
                <span className="text-xs text-gray-400 shrink-0">문의</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ICPage() {
  const [activeCategory, setActiveCategory] = useState("전체")
  const [brandsData, setBrandsData] = useState<Brand[]>(brands)
  const [query, setQuery] = useState("")

  const updateBrandImage = (brandId: string, imageUrl: string) => {
    setBrandsData(prev =>
      prev.map(brand => (brand.id === brandId ? {...brand, imageUrl} : brand))
    )
  }

  const q = query.trim().toLowerCase()

  const filtered = brandsData
    .filter(b => activeCategory === "전체" || b.category === activeCategory)
    .map(b => {
      if (!q) return b
      // 브랜드명 매치 → 모든 제품 표시, 아니면 매치되는 제품만
      const brandMatch =
        b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
      if (brandMatch) return b
      const matchedProducts = b.products.filter(p =>
        p.name.toLowerCase().includes(q)
      )
      return {...b, products: matchedProducts}
    })
    .filter(b => b.products.length > 0)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 헤더 */}
      <div className="px-6 pt-14 pb-8 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition mb-8"
          >
            ← rainskiss
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c10002] mb-4">
            Price List
          </p>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-none tracking-tighter uppercase italic text-black">
            깡 통 시 장
          </h1>
          <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mt-2">
            busan, korea
          </p>
          <p className="text-gray-500 text-sm mt-3">
            주류 가격표 · {brandsData.length}종
          </p>
        </div>
      </div>

      {/* 검색창 */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-6xl mx-auto relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="상품명·브랜드 검색…"
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-11 pr-11 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#c10002] transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? "bg-[#c10002] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              {cat}
              <span className="ml-1.5 opacity-60">
                {cat === "전체"
                  ? brandsData.length
                  : brandsData.filter(b => b.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 그리드 */}
      <div className="px-6 py-10">
        {filtered.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(brand => (
              <BrandCard
                key={brand.id}
                brand={brand}
                onImageUpdate={updateBrandImage}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto text-center py-20">
            <p className="text-gray-400 text-sm">
              {query ? `"${query}" 검색 결과 없음` : "상품 없음"}
            </p>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="px-6 py-10 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          가격은 변동될 수 있습니다
        </p>
      </div>
    </div>
  )
}
