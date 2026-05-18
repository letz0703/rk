/**
 * 프롬프트 무료 열람 허용 이메일 목록
 * 이메일 추가/제거로 접근 권한 관리
 */
export const PROMPT_WHITELIST: string[] = [
  "rainskiss@gmail.com",
  "icanmart@gmail.com",
  "letz0703@gmail.com",
]

export function isWhitelisted(email: string | null | undefined): boolean {
  if (!email) return false
  return PROMPT_WHITELIST.includes(email.toLowerCase())
}
