// 영문 연재 목록. 원고 본문은 content/stories/{series}/{episode}.md
// 새 화 = episodes에 한 줄 + md 파일 하나. 삽화는 public/stories/{series}/ 또는 외부 URL.

export type Episode = {
  slug: string // "01" → /stories/{series}/01, 파일 content/stories/{series}/01.md
  title: string
  heroine?: string // 그 화의 여자
  hero?: string // 맨 위 대표 삽화(순한 것). 나머지 삽화는 md 안 장면 자리에 ![](url)
  themeSong?: { url: string; title: string } // YouTube 링크 — 화마다 다르면 여기, 없으면 시리즈 것
  daUrl?: string // 같은 화 DA 게시물 (센 이미지)
  publishedAt: string // YYYY-MM-DD
}

export type Series = {
  slug: string
  title: string
  tagline: string
  cover: string
  themeSong?: { url: string; title: string }
  daUrl?: string
  episodes: Episode[]
}

export const series: Series[] = []

export function getSeries(slug: string) {
  return series.find(s => s.slug === slug)
}

export function getEpisode(seriesSlug: string, epSlug: string) {
  const s = getSeries(seriesSlug)
  if (!s) return null
  const idx = s.episodes.findIndex(e => e.slug === epSlug)
  if (idx === -1) return null
  return { series: s, episode: s.episodes[idx], prev: s.episodes[idx - 1], next: s.episodes[idx + 1] }
}
