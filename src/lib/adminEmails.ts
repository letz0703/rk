// 관리자 이메일 — 클라이언트(AuthContext)와 서버 API(shop-access)가 같이 쓴다.
export const ADMIN_EMAILS = [
  "rainskiss@gmail.com",
  "icanmart@gmail.com",
  ...(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").split(",").map(email => email.trim()).filter(Boolean)
]
