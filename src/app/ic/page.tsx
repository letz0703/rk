"use client"

import { useState } from "react"
import Link from "next/link"

type Item = {
  id: number
  brand: string
  brandEn: string
  expr: string
  price: number | null
  img: string
  emoji: string
  category: string
}

const items: Item[] = [
  // ── 그린피더 (Glenfiddich) ──────────────────────────────────
  { id: 1,  brand: "그린피더", brandEn: "Glenfiddich", expr: "12년", price: 62000,  img: "https://www.thewhiskyexchange.com/p/77/glenfiddich-12-year-old", emoji: "🌿", category: "싱글몰트" },
  { id: 2,  brand: "그린피더", brandEn: "Glenfiddich", expr: "15년", price: 85000,  img: "", emoji: "🌿", category: "싱글몰트" },
  { id: 3,  brand: "그린피더", brandEn: "Glenfiddich", expr: "오렌지", price: 119000, img: "", emoji: "🌿", category: "싱글몰트" },
  { id: 4,  brand: "그린피더", brandEn: "Glenfiddich", expr: "18년", price: 180000, img: "", emoji: "🌿", category: "싱글몰트" },
  { id: 5,  brand: "그린피더", brandEn: "Glenfiddich", expr: "21년", price: 280000, img: "", emoji: "🌿", category: "싱글몰트" },

  // ── 로얄살루트 (Royal Salute) ──────────────────────────────
  { id: 6,  brand: "로얄살루트", brandEn: "Royal Salute", expr: "21년", price: 149000, img: "", emoji: "👑", category: "블렌디드" },

  // ── 바렌타인 (Ballantine's) ────────────────────────────────
  { id: 7,  brand: "바렌타인", brandEn: "Ballantine's", expr: "17년", price: 75000,  img: "", emoji: "🏰", category: "블렌디드" },
  { id: 8,  brand: "바렌타인", brandEn: "Ballantine's", expr: "21년", price: 155000, img: "", emoji: "🏰", category: "블렌디드" },
  { id: 9,  brand: "바렌타인", brandEn: "Ballantine's", expr: "30년", price: 380000, img: "", emoji: "🏰", category: "블렌디드" },

  // ── 맥킬란 (Macallan) ─────────────────────────────────────
  { id: 10, brand: "맥킬란",   brandEn: "Macallan",     expr: "12년", price: 112000, img: "", emoji: "🏺", category: "싱글몰트" },
  { id: 11, brand: "맥킬란",   brandEn: "Macallan",     expr: "",     price: 120000, img: "", emoji: "🏺", category: "싱글몰트" },

  // ── 발버니 (Balvenie) ─────────────────────────────────────
  { id: 12, brand: "발버니",   brandEn: "Balvenie",     expr: "12년", price: 95000,  img: "", emoji: "🌾", category: "싱글몰트" },
  { id: 13, brand: "발버니",   brandEn: "Balvenie",     expr: "14년", price: 150000, img: "", emoji: "🌾", category: "싱글몰트" },

  // ── 시바스리갈 (Chivas Regal) ─────────────────────────────
  { id: 14, brand: "시바스리갈", brandEn: "Chivas Regal", expr: "12년", price: 50000, img: "", emoji: "⚔️", category: "블렌디드" },
  { id: 15, brand: "시바스리갈", brandEn: "Chivas Regal", expr: "18년", price: 85000, img: "", emoji: "⚔️", category: "블렌디드" },

  // ── 존니워커 (Johnnie Walker) ─────────────────────────────
  { id: 16, brand: "존니워커", brandEn: "Johnnie Walker", expr: "레드",    price: 33000, img: "", emoji: "🚶", category: "블렌디드" },
  { id: 17, brand: "존니워커", brandEn: "Johnnie Walker", expr: "소",      price: 45000, img: "", emoji: "🚶", category: "블렌디드" },
  { id: 18, brand: "존니워커", brandEn: "Johnnie Walker", expr: "블랙",    price: 50000, img: "", emoji: "🚶", category: "블렌디드" },
  { id: 19, brand: "존니워커", brandEn: "Johnnie Walker", expr: "더블블랙", price: 55000, img: "", emoji: "🚶", category: "블렌디드" },
  { id: 20, brand: "죠나블루", brandEn: "JW Blue Mini",  expr: "",        price: 21000, img: "", emoji: "💎", category: "블렌디드" },

  // ── 야마자키 (Yamazaki) ───────────────────────────────────
  { id: 21, brand: "야마자키", brandEn: "Yamazaki",    expr: "12년", price: 270000, img: "", emoji: "🌸", category: "일본위스키" },

  // ── 산토리 (Suntory) ──────────────────────────────────────
  { id: 22, brand: "산토리",   brandEn: "Suntory",     expr: "",     price: 25000,  img: "", emoji: "🗻", category: "일본위스키" },

  // ── 화네시 (Hennessy) ─────────────────────────────────────
  { id: 23, brand: "화네시",   brandEn: "Hennessy",    expr: "V.S.O.P", price: 80000,  img: "", emoji: "🍇", category: "코냑" },

  // ── 카무스 (Camus) ────────────────────────────────────────
  { id: 24, brand: "카무스",   brandEn: "Camus",       expr: "XO",   price: 200000, img: "", emoji: "🦁", category: "코냑" },

  // ── 잭다니엘 (Jack Daniel's) ──────────────────────────────
  { id: 25, brand: "잭다니엘", brandEn: "Jack Daniel's", expr: "",   price: 50000,  img: "", emoji: "🎸", category: "버번·테네시" },

  // ── 애플 ──────────────────────────────────────────────────
  { id: 26, brand: "애플",     brandEn: "Apple",       expr: "",     price: 50000,  img: "", emoji: "🍎", category: "버번·테네시" },

  // ── 데큐라 (Tequila) ──────────────────────────────────────
  { id: 27, brand: "데큐라",   brandEn: "Tequila",     expr: "",     price: 265000, img: "", emoji: "🌵", category: "기타" },

  // ── 마쿠라이 탱벤 ─────────────────────────────────────────
  { id: 28, brand: "마쿠라이", brandEn: "Midleton",    expr: "탱벤", price: 100000, img: "", emoji: "☘️",  category: "기타" },

  // ── 만주·쿠포타 ────────────────────────────────────────────
  { id: 29, brand: "만주(쿠포타)", brandEn: "Manju", expr: "",      price: 95000,  img: "", emoji: "🍶", category: "기타" },

  // ── 융띠 블루망다 ─────────────────────────────────────────
  { id: 30, brand: "융띠",     brandEn: "Blue Mamba",  expr: "블루망다", price: 549000, img: "", emoji: "💙", category: "싱글몰트" },

  // ── 쿠포타 만주 ───────────────────────────────────────────
  { id: 31, brand: "쿠포타만주", brandEn: "Kupotha Manju", expr: "", price: null, img: "", emoji: "🍶", category: "기타" },
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

function ItemCard({ item }: { item: Item }) {
  const [imgFailed, setImgFailed] = useState(!item.img)
  const catColor = CATEGORY_COLORS[item.category] ?? "#6b7280"

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:bg-white/8 group">
      {/* 이미지 영역 */}
      <div className="relative w-full aspect-square overflow-hidden bg-white/3">
        {!imgFailed && item.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.img}
            alt={`${item.brand} ${item.expr}`}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${catColor}18, ${catColor}06)` }}
          >
            <span className="text-4xl">{item.emoji}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
              {item.brandEn}
            </span>
          </div>
        )}
        {/* 카테고리 뱃지 */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
          style={{ backgroundColor: catColor + "cc" }}
        >
          {item.category}
        </span>
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">
          {item.brandEn}
        </p>
        <h3 className="text-sm font-black text-white leading-tight">
          {item.brand}
          {item.expr && (
            <span className="ml-1.5 text-white/50 font-semibold">{item.expr}</span>
          )}
        </h3>
        <p className="mt-3 text-xl font-black text-[#c10002]">
          {item.price !== null
            ? `₩${item.price.toLocaleString()}`
            : <span className="text-white/20 text-sm">가격 문의</span>
          }
        </p>
      </div>
    </div>
  )
}

export default function ICPage() {
  const [activeCategory, setActiveCategory] = useState("전체")

  const filtered = activeCategory === "전체"
    ? items
    : items.filter(i => i.category === activeCategory)

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
            IC
          </h1>
          <p className="text-white/30 text-sm mt-3">
            주류 가격표 · {items.filter(i => i.price !== null).length}종
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
                {cat === "전체" ? items.length : items.filter(i => i.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 그리드 */}
      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} />
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
