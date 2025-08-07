// firebase.js

import {initializeApp} from "firebase/app"
import {v4 as uuid} from "uuid"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth"
import {
  getDatabase,
  ref,
  get,
  set,
  onValue // ✅ 추가됨
} from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}
const _app = initializeApp(firebaseConfig)
const auth = getAuth(_app)
const provider = new GoogleAuthProvider()
const database = getDatabase(_app)

provider.setCustomParameters({prompt: "select_account"})

export async function login() {
  return signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user
      localStorage.setItem("user", JSON.stringify(user))
      window.dispatchEvent(new Event("admin-check"))
      return user
    })
    .catch(err => {
      console.error("Login error:", err)
    })
}

export async function logout() {
  localStorage.removeItem("user")
  window.dispatchEvent(new Event("admin-check"))
  return signOut(auth).then(() => null)
}

export function onUserStateChange(callback) {
  return onAuthStateChanged(auth, user => {
    callback(user)
  })
}

export async function addNewProduct(product, imgUrl) {
  const id = uuid()
  return set(ref(database, `product/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image: imgUrl,
    link: product.link
  })
}

// ✅ 🔽 새로 추가된 함수
export function getProducts(callback) {
  const productRef = ref(database, "product")
  onValue(productRef, snapshot => {
    const data = snapshot.val()
    if (!data) return callback([])
    const list = Object.values(data)
    callback(list)
  })
}
