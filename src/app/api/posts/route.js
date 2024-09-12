import {initializeApp} from "firebase/app";
import {collection, getDocs, getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRESTORE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIRESTORE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIRESTORE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIRESTORE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIRESTORE_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const fireStore = getFirestore(app);

export async function GET(request) {
  try {
    const querySnapshot = await getDocs(collection(fireStore, "posts")); // 'posts' 컬렉션에서 데이터를 가져옴
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // 데이터 배열 생성
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching posts: " + error.message }), { status: 500 });
  }
}
