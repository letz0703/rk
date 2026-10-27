const ALLOWED_DOMAINS = [
  // /api/shop-upload 가 Firebase Storage 로 올리고 이 도메인의 다운로드 URL 을 돌려준다.
  // 빠져 있으면 상품 페이지에서 올린 이미지가 저장은 되는데 화면에 안 뜬다.
  "firebasestorage.googleapis.com",
  "cdn.buymeacoffee.com",
  "res.cloudinary.com",
  "lh3.googleusercontent.com",
  "i.pinimg.com",
  "claude.ai",
  "pinterest.com",
  "pin.it",
  "deviantart.com",
  "www.deviantart.com"
]

/**
 * Checks if a string is a valid URL or path that can be rendered by Next.js Image.
 */
export function isValidImageUrl(src: string | undefined | null): boolean {
  if (typeof src !== "string" || !src) return false
  const trimmed = src.trim()
  if (!trimmed || trimmed === "PLACEHOLDER") return false

  if (trimmed.startsWith("/") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return true
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed)
      return ALLOWED_DOMAINS.includes(url.hostname)
    } catch {
      return false
    }
  }

  return false
}
