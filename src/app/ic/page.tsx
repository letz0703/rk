"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

type Product = {
  name: string
  price: number | null
}

type Brand = {
  id: string
  name: string
  category: string
  website: string | null
  image: string
  imageUrl?: string | null
  products: Product[]
}

const brands: Brand[] = [
  {
    id: "glenfiddich", name: "GLENFIDDICH", category: "싱글몰트",
    website: "https://www.glenfiddich.com",
    image: "/images/brands/glenfiddich.jpg",
    imageUrl: null,
    products: [
      { name: "그린피더 12년", price: 62000 },
      { name: "그린피더 15년", price: 85000 },
      { name: "그린피더 오렌지", price: 119000 },
      { name: "그린피더 18년", price: 180000 },
      { name: "그린피더 21년", price: 280000 },
    ]
  },
  {
    id: "macallan", name: "MACALLAN", category: "싱글몰트",
    website: "https://www.themacallan.com",
    image: "/images/brands/macallan.jpg",
    imageUrl: null,
    products: [
      { name: "맥킬란 12년", price: 112000 },
      { name: "맥킬란", price: 120000 },
    ]
  },
  {
    id: "balvenie", name: "BALVENIE", category: "싱글몰트",
    website: "https://www.thebalvenie.com",
    image: "/images/brands/balvenie.jpg",
    imageUrl: null,
    products: [
      { name: "발버니 12년", price: 95000 },
      { name: "발버니 14년", price: 150000 },
    ]
  },
  {
    id: "bluemamba", name: "BLUE MAMBA", category: "싱글몰트",
    website: null,
    image: "/images/brands/bluemamba.jpg",
    imageUrl: null,
    products: [
      { name: "융띠 블루망다", price: 549000 },
    ]
  },
  {
    id: "royalsalute", name: "ROYAL SALUTE", category: "블렌디드",
    website: "https://www.royalsalute.com",
    image: "/images/brands/royalsalute.jpg",
    imageUrl: null,
    products: [
      { name: "로얄살루트 21년", price: 149000 },
    ]
  },
  {
    id: "ballantines", name: "BALLANTINE'S", category: "블렌디드",
    website: "https://www.ballantines.com",
    image: "/images/brands/ballantines.jpg",
    imageUrl: null,
    products: [
      { name: "바렌타인 17년", price: 75000 },
      { name: "바렌타인 21년", price: 155000 },
      { name: "바렌타인 30년", price: 380000 },
    ]
  },
  {
    id: "chivas", name: "CHIVAS REGAL", category: "블렌디드",
    website: "https://www.chivas.com",
    image: "/images/brands/chivas.jpg",
    imageUrl: null,
    products: [
      { name: "시바스리갈 12년", price: 50000 },
      { name: "시바스리갈 18년", price: 85000 },
    ]
  },
  {
    id: "johnniewalker", name: "JOHNNIE WALKER", category: "블렌디드",
    website: "https://www.johnniewalker.com",
    image: "/images/brands/johnniewalker.jpg",
    imageUrl: null,
    products: [
      { name: "존니워커 레드", price: 33000 },
      { name: "존니워커 소", price: 45000 },
      { name: "존니워커 블랙", price: 50000 },
      { name: "존니워커 더블블랙", price: 55000 },
      { name: "죠나블루", price: 21000 },
    ]
  },
  {
    id: "yamazaki", name: "YAMAZAKI", category: "일본위스키",
    website: "https://www.suntory.com/whisky/yamazaki",
    image: "/images/brands/yamazaki.jpg",
    imageUrl: null,
    products: [
      { name: "야마자키 12년", price: 270000 },
    ]
  },
  {
    id: "suntory", name: "SUNTORY", category: "일본위스키",
    website: "https://www.suntory.com",
    image: "/images/brands/suntory.jpg",
    imageUrl: null,
    products: [
      { name: "산토리", price: 25000 },
    ]
  },
  {
    id: "hennessy", name: "HENNESSY", category: "코냑",
    website: "https://www.hennessy.com",
    image: "/images/brands/hennessy.jpg",
    imageUrl: null,
    products: [
      { name: "화네시 V.S.O.P", price: 80000 },
    ]
  },
  {
    id: "camus", name: "CAMUS", category: "코냑",
    website: "https://www.camus.fr",
    image: "/images/brands/camus.jpg",
    imageUrl: null,
    products: [
      { name: "카무스 XO", price: 200000 },
    ]
  },
  {
    id: "jackdaniels", name: "JACK DANIEL'S", category: "버번·테네시",
    website: "https://www.jackdaniels.com",
    image: "/images/brands/jackdaniels.jpg",
    imageUrl: null,
    products: [
      { name: "잭다니엘", price: 50000 },
    ]
  },
  {
    id: "apple", name: "APPLE", category: "버번·테네시",
    website: null,
    image: "/images/brands/apple.jpg",
    imageUrl: null,
    products: [
      { name: "애플", price: 50000 },
    ]
  },
  {
    id: "tequila", name: "TEQUILA", category: "기타",
    website: null,
    image: "/images/brands/tequila.jpg",
    imageUrl: null,
    products: [
      { name: "데큐라", price: 265000 },
    ]
  },
  {
    id: "midleton", name: "MIDLETON", category: "기타",
    website: "https://www.midletonveryrare.com",
    image: "/images/brands/midleton.jpg",
    imageUrl: null,
    products: [
      { name: "마쿠라이 탱벤", price: 100000 },
    ]
  },
  {
    id: "manju", name: "MANJU", category: "기타",
    website: null,
    image: "/images/brands/manju.jpg",
    imageUrl: null,
    products: [
      { name: "만주(쿠포타)", price: 95000 },
      { name: "쿠포타만주", price: null },
    ]
  },
]

const CATEGORIES = ["전체", "싱글몰트", "블렌디드", "일본위스키", "코냑", "버번·테네시", "기타"]

const CATEGORY_COLORS: Record<string, string> = {
  싱글몰트: "#3b82f6",
  블렌디드: "#f59e0b",
  일본위스키: "#ec4899",
  코냑: "#a78bfa",
  "버번·테네시": "#f97316",
  기타: "#6b7280",
}

function BrandCard({ brand, onImageUpdate }: { brand: Brand; onImageUpdate: (brandId: string, imageUrl: string) => void }) {
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
    if (!file || !file.type.startsWith('image/')) return

    const imageUrl = URL.createObjectURL(file)
    onImageUpdate(brand.id, imageUrl)
  }

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
      {/* 썸네일 영역 */}
      <div
        className={`relative w-full aspect-[4/3] overflow-hidden bg-white/5 ${
          isDragOver ? 'border-2 border-dashed border-[#c10002]' : ''
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
          <Image
            src={brand.imageUrl || brand.image}
            alt={brand.name}
            fill
            className="object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${catColor}18, ${catColor}06)` }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
              {brand.name}
            </span>
          </div>
        )}
        {/* 카테고리 뱃지 */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: catColor + "cc" }}
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
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          {brand.name}
        </h3>
        <div className="border-t border-white/8 mt-3 mb-3" />
        <div className="space-y-2">
          {brand.products.map((product, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs text-white/60">{product.name}</span>
              {product.price !== null ? (
                <span className="text-xs font-black text-[#c10002]">
                  ₩{product.price.toLocaleString()}
                </span>
              ) : (
                <span className="text-xs text-white/30">문의</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ICPage() {
  const [activeCategory, setActiveCategory] = useState("전체")
  const [brandsData, setBrandsData] = useState<Brand[]>(brands)

  const updateBrandImage = (brandId: string, imageUrl: string) => {
    setBrandsData(prev =>
      prev.map(brand =>
        brand.id === brandId ? { ...brand, imageUrl } : brand
      )
    )
  }

  const filtered = activeCategory === "전체"
    ? brandsData
    : brandsData.filter(b => b.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* 헤더 */}
      <div className="px-6 pt-14 pb-8 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition mb-8"
          >
            ← rainskiss
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c10002] mb-4">
            Price List
          </p>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-none tracking-tighter uppercase italic text-white">
            CANMART
          </h1>
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase mt-2">
            busan, korea
          </p>
          <p className="text-white/30 text-sm mt-3">
            주류 가격표 · {brandsData.length}종
          </p>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? "bg-[#c10002] text-white"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
              }`}
            >
              {cat}
              <span className="ml-1.5 opacity-60">
                {cat === "전체" ? brandsData.length : brandsData.filter(b => b.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 그리드 */}
      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(brand => (
            <BrandCard key={brand.id} brand={brand} onImageUpdate={updateBrandImage} />
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <div className="px-6 py-10 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
          가격은 변동될 수 있습니다
        </p>
      </div>
    </div>
  )
}
