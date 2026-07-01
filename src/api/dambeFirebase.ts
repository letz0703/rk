// /dambe (어머니 가게 담배 가격표) Firebase 저장소 — /dambe-brands/{id}
// 정적 src/data/dambe-brands.ts = 시드/폴백. FB에 override 있으면 그게 우선.
// 구조는 icFirebase와 동일, 네임스페이스만 분리(dambe-*).
import {database} from "@/api/firebase"
import {ref, set, onValue, push, update, remove} from "firebase/database"
import type {Brand} from "@/data/dambe-brands"
import type {IcOrder, OrderStatus} from "@/api/icFirebase"

export type {IcOrder, OrderStatus}

const ROOT = "dambe-brands"

// 실시간 구독 → {id: Brand} 맵. 없으면 빈 객체.
export function fbSubscribeBrands(
  cb: (map: Record<string, Brand>) => void
): () => void {
  const r = ref(database, ROOT)
  return onValue(r, snap => {
    cb(snap.exists() ? (snap.val() as Record<string, Brand>) : {})
  })
}

// 브랜드 1개 통째로 저장(생성/수정 공용).
export async function fbSaveBrand(brand: Brand): Promise<void> {
  if (!brand.id) throw new Error("brand id required")
  const clean = JSON.parse(JSON.stringify(brand))
  await set(ref(database, `${ROOT}/${brand.id}`), clean)
}

// 제품 1개 가격 수정 → 브랜드 통째 저장
export async function fbUpdateProductPrice(
  brand: Brand,
  index: number,
  price: number | null
): Promise<void> {
  const products = brand.products.map((p, i) =>
    i === index ? {...p, price} : p
  )
  await fbSaveBrand({...brand, products})
}

// 제품 1개 이미지 수정 → 브랜드 통째 저장
export async function fbUpdateProductImage(
  brand: Brand,
  index: number,
  image: string
): Promise<void> {
  const products = brand.products.map((p, i) =>
    i === index ? {...p, image} : p
  )
  await fbSaveBrand({...brand, products})
}

// 제품 추가 → 브랜드 products 끝에 append
export async function fbAddProduct(
  brand: Brand,
  name: string,
  price: number | null
): Promise<void> {
  const products = [...brand.products, {name, price}]
  await fbSaveBrand({...brand, products})
}

// 제품 삭제 (index)
export async function fbRemoveProduct(
  brand: Brand,
  index: number
): Promise<void> {
  const products = brand.products.filter((_, i) => i !== index)
  await fbSaveBrand({...brand, products})
}

// 이미지 업로드 → Cloudinary(/api/ic-image). key는 dambe- 접두로 ic와 분리.
export async function fbUploadBrandImage(
  key: string,
  file: File
): Promise<string> {
  const form = new FormData()
  form.append("key", `dambe-${key}`)
  form.append("file", file)
  const res = await fetch("/api/ic-image", {method: "POST", body: form})
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "이미지 업로드 실패")
  return data.url as string
}

// ── 픽업 주문 (방문 픽업, 현장결제) ─────────────────────────────────
const ORDERS = "dambe-orders"

// 주문 생성 (고객, 비로그인).
export async function fbCreateOrder(
  order: Omit<IcOrder, "id" | "status" | "createdAt">
): Promise<string> {
  const payload = {
    ...order,
    status: "new" as OrderStatus,
    createdAt: Date.now()
  }
  const clean = JSON.parse(JSON.stringify(payload))
  const r = await push(ref(database, ORDERS), clean)
  return r.key as string
}

// 주문 실시간 구독 (사장님 대시보드). 최신순 정렬.
export function fbSubscribeOrders(cb: (orders: IcOrder[]) => void): () => void {
  const r = ref(database, ORDERS)
  const off = onValue(r, snap => {
    if (!snap.exists()) return cb([])
    const obj = snap.val() as Record<string, Omit<IcOrder, "id">>
    const list = Object.entries(obj).map(([id, v]) => ({...v, id}))
    list.sort((a, b) => b.createdAt - a.createdAt)
    cb(list)
  })
  return off
}

// 주문 상태 변경 (admin)
export async function fbSetOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  await update(ref(database, `${ORDERS}/${id}`), {status})
}

// 주문 삭제 (admin)
export async function fbDeleteOrder(id: string): Promise<void> {
  await remove(ref(database, `${ORDERS}/${id}`))
}
