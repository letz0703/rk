// 서버 전용 Firebase Admin SDK — RTDB 보안규칙 우회(서버 신뢰 컨텍스트).
// 토큰 API/서버 라우트에서 shortlinks 쓰기용. 클라이언트 번들에 절대 포함 금지.
import {getApps, initializeApp, cert, type App} from "firebase-admin/app"
import {getDatabase} from "firebase-admin/database"
import {readFileSync} from "fs"
import {join} from "path"

let app: App | null = null

// 서비스계정 소스: 배포=env(FIREBASE_SERVICE_ACCOUNT JSON 문자열),
// 로컬=gitignore된 serviceAccountKey.json 파일. env 우선.
function loadServiceAccount(): Record<string, unknown> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  try {
    const file = readFileSync(join(process.cwd(), "serviceAccountKey.json"), "utf-8")
    return JSON.parse(file)
  } catch {
    return null
  }
}

function initAdmin(): App | null {
  if (app) return app
  const dbURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  const serviceAccount = loadServiceAccount()
  if (!serviceAccount || !dbURL) return null

  try {
    app = getApps().length
      ? getApps()[0]
      : initializeApp({credential: cert(serviceAccount), databaseURL: dbURL})
    return app
  } catch {
    return null
  }
}

// admin DB 핸들 (미설정이면 null → 호출부에서 처리)
export function adminDB() {
  const a = initAdmin()
  return a ? getDatabase(a) : null
}
