import {initializeApp} from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth"
import {getDatabase, ref, get} from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, // ← 잘못된 키
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID
}

const _app = initializeApp(firebaseConfig)
const auth = getAuth(_app) // ✅ 명시적 전달
const provider = new GoogleAuthProvider()
provider.setCustomParameters({prompt: "select_account"})

export async function login() {
  return signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user))
        window.dispatchEvent(new Event("admin-check"))
      }
      console.log(user)
      return user
    })
    .catch(err => {
      console.error("Login error:", err)
    })
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    window.dispatchEvent(new Event("admin-check"))
  }
  return signOut(auth).then(() => null)
}

export function onUserStateChange(callback) {
  return onAuthStateChanged(auth, user => {
    callback(user)
  })
}
