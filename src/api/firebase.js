import {initializeApp} from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
  //onAuthStateChanged
} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

const _app = initializeApp(firebaseConfig)
const auth = getAuth()
const provider = new GoogleAuthProvider()

export async function login() {
  return signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user
      console.log(user)
      return user
    })
    .catch(console.error)
}

export async function logout() {
  return signOut(auth).then(() => null)
}

//export function onUserStateChange(callback) {
//  onAuthStateChanged(auth, user => {
//    callback(user)
//  })
//}
