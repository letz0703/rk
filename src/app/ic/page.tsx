"use client"

import {useEffect, useRef, useState} from "react"
import Link from "next/link"
import {
  ExternalLink,
  Search,
  X,
  Upload,
  Loader2,
  Check,
  ChevronRight,
  Plus,
  Trash2
} from "lucide-react"
import {mergeBrands, productSlug, type Brand} from "@/data/ic-brands"
import {useAuthContext} from "@/components/context/AuthContext"
import {
  fbSubscribeBrands,
  fbUpdateProductPrice,
  fbSaveBrand,
  fbUploadBrandImage,
  fbAddProduct,
  fbRemoveProduct,
  fbDeleteBrand
} from "@/api/icFirebase"

// 상위 섹션: 양주(위스키 하위 카테고리 포함) / 손수건 / 담배
const SECTIONS = ["전체", "양주", "손수건", "담배"] as const
type Section = (typeof SECTIONS)[number]

const WHISKY_CATEGORIES = [
  "전체",
  "싱글몰트",
  "블렌디드",
  "일본위스키",
  "코냑",
  "버번·테네시",
  "기타"
]

// 브랜드 → 섹션 매핑 (손수건·담배 외엔 전부 양주)
function sectionOf(b: Brand): Exclude<Section, "전체"> {
  if (b.category === "손수건") return "손수건"
  if (b.category === "담배") return "담배"
  return "양주"
}

const CATEGORY_COLORS: Record<string, string> = {
  싱글몰트: "#3b82f6",
  블렌디드: "#f59e0b",
  일본위스키: "#ec4899",
  코냑: "#a78bfa",
  "버번·테네시": "#f97316",
  기타: "#6b7280",
  손수건: "#10b981",
  담배: "#92400e"
}

// admin 새 카드 추가 시 선택 가능한 카테고리
const ADMIN_CATEGORIES = [
  "싱글몰트",
  "블렌디드",
  "일본위스키",
  "코냑",
  "버번·테네시",
  "기타",
  "손수건",
  "담배"
]

// 브랜드 한글 검색 별칭 (영문 brand.name으로는 한글 검색 안 되므로)
const BRAND_ALIASES: Record<string, string> = {
  glenfiddich: "글랜피딕 글렌피딕",
  macallan: "맥캘란 맥켈란 맥켈렌",
  balvenie: "발베니 발버니",
  royalsalute: "로얄살루트",
  ballantines: "발렌타인 바렌타인",
  chivas: "시바스리갈 시바스",
  johnniewalker: "조니워커 존니워커 조나",
  yamazaki: "야마자키",
  suntory: "산토리",
  hennessy: "헤네시 화네시",
  camus: "카무스 까뮤",
  jackdaniels: "잭다니엘 잭다니엘스",
  apple: "애플",
  tequila: "데킬라 데큐라 데낄라",
  midleton: "미들턴 마쿠라이",
  manju: "만주 만쥬 쿠보타 쿠포타",
  handkerchief: "손수건 스카프 자수",
  marlboro: "말보로 말버러 담배",
  dunhill: "던힐 담배",
  parliament: "팔러먼트 팔리아멘트 담배",
  mevius: "메비우스 마일드세븐 담배"
}

// 가격 한 줄 (admin = 인라인 입력, 일반 = 링크)
function PriceRow({
  brand,
  index,
  isAdmin,
  onSavePrice,
  onDelete
}: {
  brand: Brand
  index: number
  isAdmin: boolean
  onSavePrice: (brand: Brand, index: number, price: number | null) => Promise<void>
  onDelete: (brand: Brand, index: number) => Promise<void>
}) {
  const product = brand.products[index]
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(
    product.price !== null ? String(product.price) : ""
  )
  const [saving, setSaving] = useState(false)

  // 외부에서 가격 바뀌면 draft 동기화 (편집 중 아닐 때만)
  useEffect(() => {
    if (!editing) setDraft(product.price !== null ? String(product.price) : "")
  }, [product.price, editing])

  const commit = async () => {
    const trimmed = draft.trim()
    const next = trimmed === "" ? null : Number(trimmed.replace(/[^0-9]/g, ""))
    setEditing(false)
    if ((next ?? null) === (product.price ?? null)) return
    setSaving(true)
    try {
      await onSavePrice(brand, index, next)
    } finally {
      setSaving(false)
    }
  }

  if (isAdmin) {
    return (
      <div className="flex justify-between items-center gap-2 -mx-1 px-1 py-0.5">
        <Link
          href={`/ic/${productSlug(brand.id, index)}`}
          className="text-xs text-gray-700 truncate hover:text-[#c10002] hover:underline transition-colors"
          title="상세 페이지 보기"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-gray-400">₩</span>
          <input
            type="text"
            inputMode="numeric"
            value={draft}
            onFocus={() => setEditing(true)}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur()
              if (e.key === "Escape") {
                setDraft(product.price !== null ? String(product.price) : "")
                setEditing(false)
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            placeholder="문의"
            className="w-20 text-right text-xs font-black text-[#c10002] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#c10002]"
          />
          {saving && <Loader2 size={12} className="animate-spin text-gray-400" />}
          {/* 제품 삭제 */}
          <button
            onClick={() => {
              if (confirm(`"${product.name}" 삭제할까요?`)) onDelete(brand, index)
            }}
            className="text-gray-300 hover:text-red-500 transition-colors"
            title="제품 삭제"
          >
            <Trash2 size={13} />
          </button>
          {/* 상세 페이지(글 작성) 이동 */}
          <Link
            href={`/ic/${productSlug(brand.id, index)}`}
            className="text-gray-300 hover:text-[#c10002] transition-colors"
            title="상세 페이지 / 글 작성"
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Link
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
  )
}

function BrandCard({
  brand,
  isAdmin,
  onImageUpload,
  onSavePrice,
  onAddProduct,
  onDeleteProduct,
  onDeleteBrand
}: {
  brand: Brand
  isAdmin: boolean
  onImageUpload: (brand: Brand, file: File) => Promise<void>
  onSavePrice: (brand: Brand, index: number, price: number | null) => Promise<void>
  onAddProduct: (brand: Brand, name: string, price: number | null) => Promise<void>
  onDeleteProduct: (brand: Brand, index: number) => Promise<void>
  onDeleteBrand: (brand: Brand) => Promise<void>
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [adding, setAdding] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const catColor = CATEGORY_COLORS[brand.category] ?? "#6b7280"

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name) return
    const priceNum =
      newPrice.trim() === "" ? null : Number(newPrice.replace(/[^0-9]/g, ""))
    setAdding(true)
    try {
      await onAddProduct(brand, name, priceNum)
      setNewName("")
      setNewPrice("")
    } finally {
      setAdding(false)
    }
  }

  const handleFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return
    setUploading(true)
    try {
      await onImageUpload(brand, file)
      setImgFailed(false)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 1500)
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return
    e.preventDefault()
    setIsDragOver(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    if (!isAdmin) return
    e.preventDefault()
    setIsDragOver(false)
    handleFile(e.dataTransfer.files[0])
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
        {/* 드래그/업로드 오버레이 */}
        {(isDragOver || uploading) && (
          <div className="absolute inset-0 bg-[#c10002]/20 flex items-center justify-center z-10">
            {uploading ? (
              <Loader2 size={20} className="animate-spin text-white" />
            ) : (
              <span className="text-white text-sm font-black uppercase tracking-wider">
                이미지 드롭
              </span>
            )}
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
        {/* admin: 이미지 업로드 버튼 */}
        {isAdmin && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur rounded-full px-2.5 py-1.5 text-white/90 hover:bg-[#c10002] transition-colors"
            >
              {justSaved ? <Check size={12} /> : <Upload size={12} />}
              <span className="text-[9px] font-black uppercase tracking-wider">
                {justSaved ? "저장됨" : "이미지"}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider truncate">
            {brand.name}
          </h3>
          {isAdmin && (
            <button
              onClick={() => {
                if (confirm(`"${brand.name}" 카드를 통째로 삭제할까요?`))
                  onDeleteBrand(brand)
              }}
              className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
              title="카드 삭제"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="border-t border-gray-100 mt-3 mb-3" />
        <div className="space-y-2">
          {brand.products.map((_, index) => (
            <PriceRow
              key={index}
              brand={brand}
              index={index}
              isAdmin={isAdmin}
              onSavePrice={onSavePrice}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>

        {/* admin: 제품 추가 */}
        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex items-center gap-1.5">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="새 제품명"
              className="flex-1 min-w-0 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#c10002]"
            />
            <input
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              inputMode="numeric"
              placeholder="가격"
              className="w-16 text-right text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#c10002]"
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              className="shrink-0 bg-[#c10002] disabled:opacity-30 text-white rounded p-1 hover:bg-[#a00001] transition-colors"
              title="제품 추가"
            >
              {adding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ICPage() {
  const {isAdmin, user, login, logout} = useAuthContext()
  const [activeSection, setActiveSection] = useState<Section>("전체")
  const [activeCategory, setActiveCategory] = useState("전체")
  const [overrides, setOverrides] = useState<Record<string, Brand>>({})
  const [query, setQuery] = useState("")
  // admin: 새 카드 추가
  const [newBrandName, setNewBrandName] = useState("")
  const [newBrandCat, setNewBrandCat] = useState(ADMIN_CATEGORIES[0])
  const [addingBrand, setAddingBrand] = useState(false)

  // Firebase override 구독 (정적 brands 위에 덮어씀)
  useEffect(() => {
    const off = fbSubscribeBrands(setOverrides)
    return () => off()
  }, [])

  // 정적 시드 + FB override 병합 (사장님이 추가한 FB 전용 카드 포함)
  const brandsData: Brand[] = mergeBrands(overrides)

  // admin: 새 카드(브랜드) 추가 → FB에만 저장, mergeBrands가 화면에 합류시킴
  const handleAddBrand = async () => {
    const name = newBrandName.trim()
    if (!name) return
    const base =
      name
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, "")
        .slice(0, 24) || "item"
    const existing = new Set(brandsData.map(b => b.id))
    let id = base
    let n = 2
    while (existing.has(id)) id = `${base}${n++}`
    setAddingBrand(true)
    try {
      await fbSaveBrand({
        id,
        name,
        category: newBrandCat,
        website: null,
        image: "",
        imageUrl: null,
        products: [{name, price: null}]
      })
      setNewBrandName("")
    } catch (e) {
      alert("카드 추가 실패: " + (e as Error).message)
    } finally {
      setAddingBrand(false)
    }
  }

  // 가격 저장: 현재 머지된 브랜드 기준으로 통째 저장
  const handleSavePrice = async (
    brand: Brand,
    index: number,
    price: number | null
  ) => {
    await fbUpdateProductPrice(brand, index, price)
  }

  // 이미지 업로드 → Storage → imageUrl 저장
  const handleImageUpload = async (brand: Brand, file: File) => {
    const url = await fbUploadBrandImage(brand.id, file)
    await fbSaveBrand({...brand, imageUrl: url})
  }

  // 제품 추가/삭제
  const handleAddProduct = async (
    brand: Brand,
    name: string,
    price: number | null
  ) => {
    await fbAddProduct(brand, name, price)
  }
  const handleDeleteProduct = async (brand: Brand, index: number) => {
    await fbRemoveProduct(brand, index)
  }
  const handleDeleteBrand = async (brand: Brand) => {
    await fbDeleteBrand(brand.id)
  }

  const q = query.trim().toLowerCase()

  // 섹션 필터 → (양주일 때만) 하위 카테고리 필터 → 검색
  const inSection = brandsData.filter(
    b => activeSection === "전체" || sectionOf(b) === activeSection
  )

  const filtered = inSection
    .filter(
      b =>
        activeSection !== "양주" ||
        activeCategory === "전체" ||
        b.category === activeCategory
    )
    .map(b => {
      if (!q) return b
      // 브랜드명(영문)·카테고리·한글 별칭 매치 → 모든 제품 표시
      const alias = BRAND_ALIASES[b.id] || ""
      const brandMatch =
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        alias.includes(q)
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
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition"
            >
              ← rainskiss
            </Link>
            {/* 사장님 메뉴 (주문관리 + 로그인) */}
            <div className="flex items-center gap-4">
              {/* 문의 게시판: 모두에게 노출 */}
              <Link
                href="/ic/board"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#c10002] transition"
              >
                문의 게시판
              </Link>
              {/* 주문 관리: admin(rainskiss/icanmart) 로그인 시에만 노출 */}
              {isAdmin && (
                <Link
                  href="/ic/orders"
                  className="text-[10px] font-black uppercase tracking-widest text-[#c10002] hover:opacity-70 transition"
                >
                  주문 관리
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => logout()}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#c10002] transition"
                >
                  {isAdmin ? "편집중 · 로그아웃" : "로그아웃"}
                </button>
              ) : (
                <button
                  onClick={() => login()}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#c10002] transition"
                >
                  사장님 로그인
                </button>
              )}
            </div>
          </div>
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
            양주 · 손수건 · 담배 구매대행 가격표 · {brandsData.length}종
            {isAdmin && (
              <span className="ml-2 text-[#c10002] font-black">· 편집 모드</span>
            )}
          </p>

          {/* 구매대행 · 현장픽업 안내 */}
          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#c10002] mb-3">
              이용 방법 — 구매대행 · 현장 픽업
            </p>
            <ol className="space-y-1.5 text-sm text-gray-600">
              <li>
                <span className="font-black text-gray-900">1.</span>{" "}
                <Link
                  href="/ic/board"
                  className="font-black text-[#c10002] underline underline-offset-2"
                >
                  문의 게시판
                </Link>
                에 상품·가격·재고 문의 접수 (연락처는 비밀글로)
              </li>
              <li>
                <span className="font-black text-gray-900">2.</span> 담당자가
                깡통시장 현재 시세 확인 후{" "}
                <span className="font-black">게시판 답변</span>으로 안내
              </li>
              <li>
                <span className="font-black text-gray-900">3.</span>{" "}
                <span className="font-black">방문 예약</span> — 방문{" "}
                <span className="font-black text-[#c10002]">하루 전 게시판 문의 필수</span>{" "}
                · 매장 현장 픽업 · 현장 결제 (온라인 결제 없음)
              </li>
            </ol>
          </div>
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

      {/* 섹션 탭 (양주/손수건/담배) */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {SECTIONS.map(sec => (
            <button
              key={sec}
              onClick={() => {
                setActiveSection(sec)
                setActiveCategory("전체")
              }}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeSection === sec
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              {sec}
              <span className="ml-1.5 opacity-60">
                {sec === "전체"
                  ? brandsData.length
                  : brandsData.filter(b => sectionOf(b) === sec).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 양주 하위 카테고리 필터 */}
      <div
        className={`px-6 border-b border-gray-100 ${
          activeSection === "양주" ? "py-4" : "pb-4"
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {activeSection === "양주" &&
            WHISKY_CATEGORIES.map(cat => (
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
                    ? inSection.length
                    : inSection.filter(b => b.category === cat).length}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* admin: 새 카드(브랜드/품목) 추가 */}
      {isAdmin && (
        <div className="px-6 pt-6">
          <div className="max-w-6xl mx-auto bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              새 카드
            </span>
            <input
              value={newBrandName}
              onChange={e => setNewBrandName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddBrand()}
              placeholder="품목·브랜드명 (예: 신사 손수건)"
              className="flex-1 min-w-[160px] text-sm bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:border-[#c10002]"
            />
            <select
              value={newBrandCat}
              onChange={e => setNewBrandCat(e.target.value)}
              className="text-xs font-black bg-white border border-gray-200 rounded px-2 py-2 focus:outline-none focus:border-[#c10002]"
            >
              {ADMIN_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddBrand}
              disabled={addingBrand || !newBrandName.trim()}
              className="shrink-0 inline-flex items-center gap-1 bg-[#c10002] disabled:opacity-30 text-white text-xs font-black rounded px-3 py-2 hover:bg-[#a00001] transition-colors"
            >
              {addingBrand ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              추가
            </button>
          </div>
        </div>
      )}

      {/* 그리드 */}
      <div className="px-6 py-10">
        {filtered.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(brand => (
              <BrandCard
                key={brand.id}
                brand={brand}
                isAdmin={isAdmin}
                onImageUpload={handleImageUpload}
                onSavePrice={handleSavePrice}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onDeleteBrand={handleDeleteBrand}
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
