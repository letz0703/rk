const ALLOWED_DOMAINS = [
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
