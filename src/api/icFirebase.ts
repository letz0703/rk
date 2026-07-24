// /ic (어머니 가게 주류 가격표) Firebase 저장소 — /ic-brands/{id}
// 정적 src/data/ic-brands.ts = 시드/폴백. FB에 override 있으면 그게 우선.
// 편집(가격/이미지)은 admin만 (Firebase 규칙으로 강제 권장).
import {database} from "@/api/firebase"
import {ref, set, onValue, push, update, remove} from "firebase/database"
import type {Brand} from "@/data/ic-brands"

const ROOT = "ic-brands"

// 실시간 구독 → {id: Brand} 맵. 없으면 빈 객체.
export function fbSubscribeBrands(
  cb: (map: Record<string, Brand>) => void
): () => void {
  const r = ref(database, ROOT)
  return onValue(r, snap => {
    cb(snap.exists() ? (snap.val() as Record<string, Brand>) : {})
  })
}

// 브랜드 1개 통째로 저장(생성/수정 공용). products 배열 안전하게 덮어씀.
export async function fbSaveBrand(brand: Brand): Promise<void> {
  if (!brand.id) throw new Error("brand id required")
  // Firebase는 undefined 거부 → JSON 왕복으로 제거
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

// 브랜드(카드) 통째 삭제. 정적 시드 카드는 FB에서만 지워지고 시드로 복원됨.
export async function fbDeleteBrand(id: string): Promise<void> {
  await remove(ref(database, `${ROOT}/${id}`))
}

// 이미지 업로드 → Cloudinary(/api/ic-image) → secure_url 반환
// Firebase Storage는 Blaze 플랜 필요해서 안 씀. Cloudinary 무료 사용.
// key = 고유 식별자 (브랜드 "glenfiddich" 또는 제품 "glenfiddich-0")
export async function fbUploadBrandImage(
  key: string,
  file: File
): Promise<string> {
  const form = new FormData()
  form.append("key", key)
  form.append("file", file)
  const res = await fetch("/api/ic-image", {method: "POST", body: form})
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "이미지 업로드 실패")
  return data.url as string
}

// ── 픽업 주문 (방문 픽업, 현장결제, 문자 알림은 사장님 수동) ──────────
const ORDERS = "ic-orders"

export type OrderStatus = "new" | "ready" | "done"

export type IcOrder = {
  id: string
  slug: string
  productName: string
  brandName: string
  qty: number
  customerName: string
  phone: string
  pickupDate?: string
  memo?: string
  status: OrderStatus
  createdAt: number
}

// 주문 생성 (고객, 비로그인). push로 신규 키 → 규칙상 생성만 허용.
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

// ── 문의 게시판 (공개 Q&A) ──────────────────────────────────────────────
// 개인정보(전화·비밀글 내용·비공개 답변)는 공개 노드에 두지 않는다.
// 공개 노드(ic-board)엔 공개 안전 필드만, 민감정보는 admin 전용
// 노드(ic-board-private)에 분리 저장 → 공개 읽기해도 전화 안 샌다.
//
// Firebase 규칙 권장:
//   ic-board          읽기=공개, 쓰기=생성만(push), reply/삭제=admin
//   ic-board-private  읽기=admin 전용, 쓰기=생성만, 수정/삭제=admin
const BOARD = "ic-board"
const BOARDP = "ic-board-private"

export type IcPost = {
  id: string
  product?: string // 문의 상품명 (선택)
  author: string // 작성자 이름
  question: string // 공개 목록에선 비밀글이면 "" (admin은 private에서 원문 받음)
  secret?: boolean // 비밀글 = 질문 내용 비공개(담당자만)
  phone?: string // 연락처 (admin 전용, private 노드)
  reply?: string // 담당자 답변 (공개답변이면 여기, 비공개답변이면 private)
  replyPublic?: boolean // 답변 공개 여부
  createdAt: number
  repliedAt?: number
}

// 문의 작성 (고객, 비로그인).
// 공개 노드엔 공개 안전 필드만, 전화·(비밀)원문은 private 노드에.
export async function fbCreatePost(input: {
  product?: string
  author: string
  question: string
  secret?: boolean
  phone?: string
}): Promise<string> {
  const pub = {
    product: input.product || "",
    author: input.author,
    question: input.secret ? "" : input.question,
    secret: !!input.secret,
    createdAt: Date.now()
  }
  const r = await push(ref(database, BOARD), JSON.parse(JSON.stringify(pub)))
  const id = r.key as string
  // private: 전화 + 원문 질문 (admin 전용)
  const priv = {phone: input.phone || "", question: input.question}
  await set(ref(database, `${BOARDP}/${id}`), JSON.parse(JSON.stringify(priv)))
  return id
}

// 공개 문의 구독 (모두). 최신순. 비밀글은 question=""로 옴.
export function fbSubscribePosts(cb: (posts: IcPost[]) => void): () => void {
  const r = ref(database, BOARD)
  return onValue(r, snap => {
    if (!snap.exists()) return cb([])
    const obj = snap.val() as Record<string, Omit<IcPost, "id">>
    const list = Object.entries(obj).map(([id, v]) => ({...v, id}))
    list.sort((a, b) => b.createdAt - a.createdAt)
    cb(list)
  })
}

// private 구독 (admin 전용): {id: {phone, question, reply?}}
export type IcPostPrivate = {phone?: string; question?: string; reply?: string}
export function fbSubscribePostsPrivate(
  cb: (map: Record<string, IcPostPrivate>) => void
): () => void {
  const r = ref(database, BOARDP)
  return onValue(r, snap => {
    cb(snap.exists() ? (snap.val() as Record<string, IcPostPrivate>) : {})
  })
}

// 답변 등록/수정 (admin). isPublic=true면 공개 노드, false면 private 노드에.
export async function fbSetPostReply(
  id: string,
  reply: string,
  isPublic: boolean
): Promise<void> {
  if (isPublic) {
    await update(ref(database, `${BOARD}/${id}`), {
      reply,
      replyPublic: true,
      repliedAt: Date.now()
    })
    // private에 남아있던 비공개 답변 정리
    await update(ref(database, `${BOARDP}/${id}`), {reply: null})
  } else {
    // 공개 노드엔 "답변완료·비공개" 표시만, 원문은 private로
    await update(ref(database, `${BOARD}/${id}`), {
      reply: "",
      replyPublic: false,
      repliedAt: Date.now()
    })
    await update(ref(database, `${BOARDP}/${id}`), {reply})
  }
}

// 문의 삭제 (admin) — 공개·private 둘 다
export async function fbDeletePost(id: string): Promise<void> {
  await remove(ref(database, `${BOARD}/${id}`))
  await remove(ref(database, `${BOARDP}/${id}`))
}
