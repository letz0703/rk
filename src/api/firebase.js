// Firebase client (singleton)
import {initializeApp, getApps, getApp} from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth"
import {getDatabase, ref, set, get, push, remove, update, onValue, off} from "firebase/database"
import {v4 as uuid} from "uuid"
import {getStorage, ref as storageRef, listAll, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)

setPersistence(auth, browserLocalPersistence).catch(() => {})

const provider = new GoogleAuthProvider()
provider.setCustomParameters({prompt: "select_account"})

export function login() {
  return signInWithPopup(auth, provider).then(res => res.user)
}
export function logout() {
  return signOut(auth)
}
export function onUserStateChange(callback) {
  // returns unsubscribe
  return onAuthStateChanged(auth, callback)
}

export async function addNewProduct(product, imgUrl) {
  const id = uuid()
  const payload = {
    ...product,
    id,
    price: Number(product.price) || 0,
    image: imgUrl,
    link: product.link || "",
    createdAt: Date.now()
  }
  return set(ref(database, `product/${id}`), payload)
}

// ── Model functions ────────────────────────────────────────────────────────

export async function uploadModelImage(slug, file) {
  const id = uuid()
  const ext = file.name.split(".").pop() || "jpg"
  const sRef = storageRef(storage, `models/${slug}/${id}.${ext}`)
  const snap = await uploadBytes(sRef, file)
  return getDownloadURL(snap.ref)
}

export async function setModelProfileImage(slug, url) {
  return set(ref(database, `models/${slug}/profileImage`), url)
}

export async function addModelImage(slug, url) {
  return push(ref(database, `models/${slug}/images`), url)
}

export async function removeModelImage(slug, key, url) {
  await remove(ref(database, `models/${slug}/images/${key}`))
  try {
    const urlObj = new URL(url)
    const path = decodeURIComponent((urlObj.pathname.split("/o/")[1] ?? "").split("?")[0])
    if (path) await deleteObject(storageRef(storage, path))
  } catch (_) {}
}

export async function saveModelMeta(slug, meta) {
  return update(ref(database, `models/${slug}`), meta)
}

export function onModelData(slug, callback) {
  const r = ref(database, `models/${slug}`)
  const listener = snap => callback(snap.val())
  onValue(r, listener)
  return () => off(r, "value", listener)
}

export async function seedModelData(slug, meta) {
  return update(ref(database, `models/${slug}`), meta)
}

// Storage-only model functions (no Realtime DB)

export async function listModelImages(slug) {
  try {
    const folder = storageRef(storage, `models/${slug}`)
    const { items } = await listAll(folder)
    const urls = await Promise.all(
      items.map(item => getDownloadURL(item).then(url => ({ name: item.name, url })))
    )
    const profileEntry = urls.find(f => f.name.startsWith("profile."))
    const gallery = urls.filter(f => !f.name.startsWith("profile.")).map(f => f.url)
    return { profileImage: profileEntry?.url ?? null, gallery }
  } catch {
    return { profileImage: null, gallery: [] }
  }
}

export async function uploadModelFile(slug, type, file) {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase()
  const filename =
    type === "profile"
      ? `profile.${ext}`
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const sRef = storageRef(storage, `models/${slug}/${filename}`)
  const snap = await uploadBytes(sRef, file)
  return getDownloadURL(snap.ref)
}

export async function deleteModelFile(url) {
  const path = decodeURIComponent(
    new URL(url).pathname.split("/o/")[1]?.split("?")[0] ?? ""
  )
  if (path) await deleteObject(storageRef(storage, path))
}

// ── Gallery Entry functions (imageUrl + linkUrl pairs) ─────────────────────

/**
 * Add a gallery entry with image URL and an external link URL.
 * Stored at: models/{slug}/gallery/{id}
 */
export async function addGalleryEntry(slug, imageUrl, linkUrl) {
  const id = uuid()
  return set(ref(database, `models/${slug}/gallery/${id}`), {
    id,
    imageUrl,
    linkUrl: linkUrl || "",
    addedAt: Date.now()
  })
}

/**
 * Remove a gallery entry.
 */
export async function removeGalleryEntry(slug, entryId) {
  return remove(ref(database, `models/${slug}/gallery/${entryId}`))
}

/**
 * Listen to gallery entries, sorted by addedAt ascending.
 */
export function onGalleryEntries(slug, callback) {
  const r = ref(database, `models/${slug}/gallery`)
  const listener = snap => {
    const data = snap.val()
    const list = data
      ? Object.values(data).sort((a, b) => (a.addedAt ?? 0) - (b.addedAt ?? 0))
      : []
    callback(list)
  }
  onValue(r, listener)
  return () => off(r, "value", listener)
}

// ── Lookbook Request functions ─────────────────────────────────────────────

/**
 * Submit a new lookbook request.
 * @param {string} modelSlug
 * @param {{ userId: string|null, userName: string, content: string, type: "standard"|"tier_priority", visibility: "public"|"private" }} request
 */
export async function submitRequest(modelSlug, request) {
  const id = uuid()
  const payload = {
    id,
    userId: request.userId ?? null,
    userName: request.userName,
    content: request.content,
    type: request.type ?? "standard",          // "standard" | "tier_priority"
    visibility: request.visibility ?? "public", // "public" | "private"
    status: "pending",                          // "pending" | "in_progress" | "completed"
    createdAt: Date.now()
  }
  return set(ref(database, `lookbook_requests/${modelSlug}/${id}`), payload)
}

/**
 * Listen to all requests for a model, sorted: tier_priority first, then by createdAt.
 * @param {string} modelSlug
 * @param {(list: object[]) => void} callback
 * @param {(err: Error) => void} [onError]
 */
export function onRequests(modelSlug, callback, onError) {
  const r = ref(database, `lookbook_requests/${modelSlug}`)
  const listener = snap => {
    const data = snap.val()
    const list = data
      ? Object.entries(data).map(([id, v]) => ({...v, id}))
      : []
    list.sort((a, b) => {
      if (a.type === "tier_priority" && b.type !== "tier_priority") return -1
      if (b.type === "tier_priority" && a.type !== "tier_priority") return 1
      return (a.createdAt ?? 0) - (b.createdAt ?? 0)
    })
    callback(list)
  }
  onValue(r, listener, err => onError?.(err))
  return () => off(r, "value", listener)
}

/**
 * Update request status (admin only).
 */
export async function updateRequestStatus(modelSlug, reqId, status) {
  return update(ref(database, `lookbook_requests/${modelSlug}/${reqId}`), {status})
}

/**
 * Delete a request.
 */
export async function deleteRequest(modelSlug, reqId) {
  return remove(ref(database, `lookbook_requests/${modelSlug}/${reqId}`))
}

/**
 * Add a reply to a request.
 * @param {string} modelSlug
 * @param {string} reqId
 * @param {{ content: string, authorName: string }} reply
 */
export async function addRequestReply(modelSlug, reqId, reply) {
  const id = uuid()
  return set(ref(database, `lookbook_requests/${modelSlug}/${reqId}/replies/${id}`), {
    id,
    content: reply.content,
    authorName: reply.authorName,
    createdAt: Date.now()
  })
}

/**
 * Delete a reply from a request.
 */
export async function deleteRequestReply(modelSlug, reqId, replyId) {
  return remove(ref(database, `lookbook_requests/${modelSlug}/${reqId}/replies/${replyId}`))
}

// ── Product functions ──────────────────────────────────────────────────────

// ── Life Song functions ────────────────────────────────────────────────────

export async function submitLifeSong({ name, songTitle, artist, youtubeUrl, story }) {
  const id = uuid()
  return set(ref(database, `lifesongs/${id}`), {
    id,
    name: name || "Anonymous",
    songTitle,
    artist,
    youtubeUrl: youtubeUrl || "",
    story,
    approved: false,
    createdAt: Date.now()
  })
}

export function onApprovedLifeSongs(callback) {
  const r = ref(database, "lifesongs")
  const listener = snap => {
    const data = snap.val()
    const list = data
      ? Object.values(data)
          .filter(s => s.approved)
          .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
      : []
    callback(list)
  }
  onValue(r, listener)
  return () => off(r, "value", listener)
}

export function onAllLifeSongs(callback) {
  const r = ref(database, "lifesongs")
  const listener = snap => {
    const data = snap.val()
    const list = data
      ? Object.values(data).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      : []
    callback(list)
  }
  onValue(r, listener)
  return () => off(r, "value", listener)
}

export async function approveLifeSong(id) {
  return update(ref(database, `lifesongs/${id}`), { approved: true })
}

export async function deleteLifeSong(id) {
  return remove(ref(database, `lifesongs/${id}`))
}

export function getProducts(onData, onError) {
  const productRef = ref(database, "product")
  const listener = snap => {
    const data = snap.val()
    const list = data ? Object.entries(data).map(([id, v]) => ({id, ...v})) : []
    // 최신순
    list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    onData(list)
  }
  const err = e => onError?.(e)
  onValue(productRef, listener, err)
  // unsubscribe
  return () => off(productRef, "value", listener)
}
