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
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
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

// ── Product functions ──────────────────────────────────────────────────────

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
