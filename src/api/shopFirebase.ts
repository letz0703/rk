// Firebase 단일 상품 저장소 — /shop-products/{slug}
// obsidian/md 폐기. 편집·등록·전시 전부 Firebase. 모델 = 투명 마네킹, 옷만 등록.
import {database} from "@/api/firebase"
import {ref, get, set, remove, onValue, update} from "firebase/database"
import type {ShopProduct, Category} from "@/data/shop-products"

export type FBProduct = {
  slug: string
  title: string
  category: string
  price: number
  premiumPrice?: number
  status: "on" | "off" // 전시 여부 (on = /shop 노출)
  previewImage: string // 유리 마네킹 메인 썸네일
  gallery: string[] // 추가 이미지 URL/링크
  description: string
  prompts: {
    soft: string
    hard: string
    softModel: string
    hardModel: string
  }
  createdAt: number
  updatedAt: number
}

const ROOT = "shop-products"

export function emptyProduct(slug = ""): FBProduct {
  const now = Date.now()
  return {
    slug,
    title: "",
    category: "Bodysuit",
    price: 3,
    status: "off",
    previewImage: "",
    gallery: [],
    description: "",
    prompts: {soft: "", hard: "", softModel: "", hardModel: ""},
    createdAt: now,
    updatedAt: now
  }
}

// Firebase는 빈 배열/객체/문자열을 드롭하므로, 읽을 때 누락 필드를 기본값으로 채움
function normalize(raw: any, slug: string): FBProduct {
  const base = emptyProduct(slug)
  return {
    ...base,
    ...raw,
    slug: raw?.slug || slug,
    gallery: Array.isArray(raw?.gallery) ? raw.gallery : [],
    prompts: {...base.prompts, ...(raw?.prompts || {})}
  }
}

// 단건 읽기
export async function fbGetProduct(slug: string): Promise<FBProduct | null> {
  const snap = await get(ref(database, `${ROOT}/${slug}`))
  return snap.exists() ? normalize(snap.val(), slug) : null
}

// 전체 읽기 (객체 → 배열)
export async function fbListProducts(): Promise<FBProduct[]> {
  const snap = await get(ref(database, ROOT))
  if (!snap.exists()) return []
  const obj = snap.val() as Record<string, any>
  return Object.entries(obj).map(([slug, v]) => normalize(v, slug))
}

// 실시간 구독 (목록)
export function fbSubscribeProducts(cb: (products: FBProduct[]) => void): () => void {
  const r = ref(database, ROOT)
  const off = onValue(r, snap => {
    if (!snap.exists()) return cb([])
    const obj = snap.val() as Record<string, any>
    cb(Object.entries(obj).map(([slug, v]) => normalize(v, slug)))
  })
  return off
}

// 저장 (생성/수정 공용) — admin만 (규칙으로 강제)
export async function fbSaveProduct(p: FBProduct): Promise<void> {
  if (!p.slug) throw new Error("slug required")
  // Firebase는 undefined 거부 → JSON 왕복으로 undefined 프로퍼티 제거
  const clean = JSON.parse(JSON.stringify({...p, updatedAt: Date.now()}))
  await set(ref(database, `${ROOT}/${p.slug}`), clean)
}

// 부분 수정
export async function fbUpdateProduct(slug: string, patch: Partial<FBProduct>): Promise<void> {
  await update(ref(database, `${ROOT}/${slug}`), {...patch, updatedAt: Date.now()})
}

// 전시 on/off
export async function fbSetStatus(slug: string, status: "on" | "off"): Promise<void> {
  await update(ref(database, `${ROOT}/${slug}`), {status, updatedAt: Date.now()})
}

// 삭제
export async function fbDeleteProduct(slug: string): Promise<void> {
  await remove(ref(database, `${ROOT}/${slug}`))
}

// 기존 ShopProduct(md) → FBProduct (일회성 이관용)
export function fbFromShopProduct(sp: ShopProduct): FBProduct {
  const now = Date.now()
  return {
    slug: sp.slug,
    title: sp.title.ko || sp.title.en || sp.slug,
    category: sp.category,
    price: Number(String(sp.price).replace(/[^0-9.]/g, "")) || 0,
    premiumPrice: undefined,
    status: sp.status === "active" ? "on" : "off",
    previewImage: sp.previewImage || "",
    gallery: (sp.gallery || []).filter(Boolean),
    description: sp.description.ko || sp.description.en || "",
    prompts: {
      soft: sp.content?.clothingPrompt || "",
      hard: sp.tieredPrompts?.level7_hard_complete || "",
      softModel: sp.content?.modelPrompt || "",
      hardModel: sp.tieredPrompts?.level6_erotic_pose || ""
    },
    createdAt: now,
    updatedAt: now
  }
}

// FBProduct → 기존 ShopProduct 형 변환 (ProductCard 등 재사용)
export function fbToShopProduct(p: FBProduct): ShopProduct {
  const gallery = p.gallery?.filter(Boolean) ?? []
  return {
    slug: p.slug,
    category: p.category as Category,
    status: p.status === "on" ? "active" : "draft",
    referenceUrl: "",
    title: {ko: p.title, ja: p.title, en: p.title},
    tagline: {ko: "", ja: "", en: ""},
    description: {ko: p.description, ja: p.description, en: p.description},
    previewImage: p.previewImage,
    price: `$${p.price}`,
    gallery: gallery.length ? gallery : [p.previewImage].filter(Boolean),
    content: {
      clothingPrompt: p.prompts.soft,
      modelPrompt: p.prompts.softModel,
      slideshowUrl: "",
      bonusImageUrl: p.previewImage
    },
    tieredPrompts: {
      level1_clothing: p.prompts.soft,
      level2_background: "",
      level3_camera_angle: "",
      level4_lighting: "",
      level5_pose: "",
      level6_erotic_pose: p.prompts.hardModel,
      level7_hard_complete: p.prompts.hard,
      vaultPath: ""
    }
  }
}
