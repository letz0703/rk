import {initializeApp} from "firebase/app"
import {v4 as uuid} from "uuid"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth"

import {getDatabase, ref, get, set} from "firebase/database"

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
//console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)

provider.setCustomParameters({prompt: "select_account"}) // 팝업 매번 뜨게

export async function login() {
  return signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user
      localStorage.setItem("user", JSON.stringify(user))
      window.dispatchEvent(new Event("admin-check")) // 🔥 트리거
      //console.log(user)
      return user
    })
    .catch(err => {
      console.error("Login error:", err)
    })
}

export async function logout() {
  localStorage.removeItem("user")
  window.dispatchEvent(new Event("admin-check")) // 🔥 트리거
  return signOut(auth).then(() => null)
}

export function onUserStateChange(callback) {
  return onAuthStateChanged(auth, user => {
    callback(user)
  })
}

export async function addNewProduct(product, imgUrl) {
  console.log("product", product)
  console.log("image URL", imgUrl)
  const id = uuid()
  set(ref(database, `product/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image: imgUrl
    //options: product.options.split(",")
  })
  return
}
