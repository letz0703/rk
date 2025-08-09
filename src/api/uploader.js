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
import {getDatabase, ref, set, onValue, off} from "firebase/database"
import {v4 as uuid} from "uuid"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getDatabase(app)

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
