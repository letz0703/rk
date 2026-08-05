// 서버 전용 Firebase Admin SDK — RTDB 보안규칙 우회(서버 신뢰 컨텍스트).
// 토큰 API/서버 라우트에서 shortlinks 쓰기용. 클라이언트 번들에 절대 포함 금지.
import {getApps, initializeApp, cert, type App} from "firebase-admin/app"
import {getDatabase} from "firebase-admin/database"
import {readFileSync} from "fs"
import {join} from "path"

let app: App | null = null

// private_key 줄바꿈 정규화 (env 저장 시 \n이 뭉개지는 고질병 방어).
function fixKey(sa: Record<string, unknown>): Record<string, unknown> {
  if (typeof sa.private_key === "string") {
    sa.private_key = sa.private_key.replace(/\\n/g, "\n")
  }
  return sa
}

// 서비스계정 소스 우선순위:
// 1) FIREBASE_SERVICE_ACCOUNT_B64 (base64 인코딩 JSON — env 안전, 배포 권장)
// 2) FIREBASE_SERVICE_ACCOUNT (raw JSON 문자열)
// 3) 로컬 gitignore된 serviceAccountKey.json 파일
function loadServiceAccount(): Record<string, unknown> | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64
  if (b64) {
    try {
      return fixKey(JSON.parse(Buffer.from(b64, "base64").toString("utf-8")))
    } catch {
      return null
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (raw) {
    try {
      return fixKey(JSON.parse(raw))
    } catch {
      return null
    }
  }
  try {
    const file = readFileSync(join(process.cwd(), "serviceAccountKey.json"), "utf-8")
    return fixKey(JSON.parse(file))
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
