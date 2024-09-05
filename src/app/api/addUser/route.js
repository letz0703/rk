import {initializeApp} from "firebase/app";
import {addDoc, collection, getFirestore} from "firebase/firestore";

// Firebase 설정을 환경 변수에서 가져오기
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

export async function POST(request) {
  const { name, email } = await request.json();
  try {
    const docRef = await addDoc(collection(fireStore, "users"), { name, email });
    return new Response(JSON.stringify({ id: docRef.id, name, email }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error adding user: " + error.message }), { status: 500 });
  }
}
