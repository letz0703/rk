// 🏗️ 최적화됨: 2026-05-24
// 정적 상품만 유지. 동적 상품은 getProduct()에서 로드

export type Lang = "ko" | "ja" | "en"

export type MultiLang = {
  ko: string
  ja: string
  en: string
}

export type Category =
  | "Street & Modern"
  | "Mathematical Fashion"
  | "Historical"
  | "Fantasy & Armour"

export type ShopProduct = {
  slug: string
  category: Category
  mood?: "flow" | "grok" | "balanced"
  title: MultiLang
  tagline: MultiLang
  description: MultiLang
  previewImage: string
  price: string
  gallery: string[]
  tieredPrompts: {
    level1_clothing: string
    level2_background: string
    level3_camera_angle: string
    level4_lighting: string
    level5_pose: string
    level6_erotic_pose: string
    level7_hard_complete: string
    vaultPath: string
  }
  content: {
    clothingPrompt: string
    modelPrompt: string
    slideshowUrl: string
    bonusImageUrl: string
  }
}

export const shopProducts: ShopProduct[] = [
  {
    slug: "white-halter-mini",
    category: "Street & Modern",
    title: {
      ko: "화이트 홀터넥 미니 드레스",
      ja: "ホワイト ホルターネック ミニドレス",
      en: "White Halter Neck Mini Dress"
    },
    tagline: {
      ko: "청순하면서도 세련된 — 빛 속에 서다",
      ja: "清楚で洗練された — 光の中に立つ",
      en: "Pure yet sophisticated — standing in the light"
    },
    description: {
      ko: "깨끗한 화이트 컬러와 홀터넥 디자인이 어깨와 쇄골 라인을 아름답게 드러냅니다.",
      ja: "クリーンなホワイトカラーとホルターネックデザインが肩と鎖骨のラインを美しく際立たせます。",
      en: "The clean white tone and halter neckline beautifully frame the shoulders and collarbone."
    },
    previewImage: "/shop/white-halter-mini-01.jpg",
    price: "$15",
    gallery: [
      "/shop/white-halter-mini-01.jpg",
      "/shop/white-halter-mini-02.jpg"
    ],
    tieredPrompts: {
      level1_clothing:
        "white halter neck mini dress, asymmetrical draping, flowing fabric, crisp details",
      level2_background: "bright minimal studio, soft shadows, clean aesthetic",
      level3_camera_angle: "full body shot, eye level, sharp focus",
      level4_lighting: "soft natural daylight, high-key lighting",
      level5_pose:
        "elegant standing position, one hand on hip, subtle arched back",
      level6_erotic_pose:
        "sensual back arch, dress fabric tension highlighting curves",
      level7_hard_complete:
        "Focus on the sheer gauze transparency vs the concrete shadows",
      vaultPath: "02_Notes/Visual/white-halter-mini"
    },
    content: {
      clothingPrompt:
        "white halter neck mini dress, asymmetrical draping, flowing fabric, crisp details, natural cotton blend, minimalist design",
      modelPrompt:
        "professional portrait lighting, golden hour natural light, soft shadows, confident feminine pose, elegant standing position",
      slideshowUrl:
        "https://www.deviantart.com/rainskiss/art/rainskiss-a-halter-1324765275",
      bonusImageUrl: "/shop/white-halter-bonus.jpg"
    }
  },
  {
    slug: "beige-ribbed-mini",
    category: "Street & Modern",
    title: {
      ko: "베이지 리브 미니 드레스",
      ja: "ベージュ リブ ミニドレス",
      en: "Beige Ribbed Mini Dress"
    },
    tagline: {
      ko: "매끄럽고 역동적인 — 일상의 우아함",
      ja: "滑らかでダイナミック — 日常のエレガンス",
      en: "Sleek and Dynamic — Everyday Elegance"
    },
    description: {
      ko: "부드러운 베이지 컬러의 리브 텍스처가 돋보이는 미니 드레스입니다.",
      ja: "柔らかいベージュカラーのリブテクスチャが際立つミニドレスです。",
      en: "A soft beige ribbed mini dress designed for dynamic movement and sleek silhouettes."
    },
    previewImage: "/shop/beige-ribbed-mini-01.jpeg",
    price: "$15",
    gallery: [
      "/shop/beige-ribbed-mini-01.jpeg",
      "/shop/beige-ribbed-mini-02.jpeg"
    ],
    tieredPrompts: {
      level1_clothing:
        "summer ribbed mini dress in soft beige color, thin spaghetti straps, low plunging neckline",
      level2_background:
        "minimalist concrete architecture, urban outdoor setting",
      level3_camera_angle: "low angle upward shot, dynamic composition",
      level4_lighting: "warm afternoon sun, harsh architectural shadows",
      level5_pose:
        "dynamic low crouching pose, one knee bent up, the other leg extended",
      level6_erotic_pose:
        "suggestive low squat, dress stretched tight, intimate eye contact",
      level7_hard_complete:
        "Provocative low squat, dress stretched tight revealing form, architectural chiaroscuro",
      vaultPath: "02_Notes/Visual/beige-ribbed-mini"
    },
    content: {
      clothingPrompt:
        "summer ribbed mini dress in soft beige color, thin spaghetti straps, low plunging neckline, high side slit, realistic ribbed texture",
      modelPrompt:
        "beautiful young Korean woman in a dynamic low crouching pose, one knee bent up, the other leg extended, body slightly twisted toward camera",
      slideshowUrl: "https://www.deviantart.com/rainskiss/art/1333194158",
      bonusImageUrl: "/shop/beige-ribbed-bonus.jpg"
    }
  },
  {
    slug: "arc-ezel-collection",
    category: "Street & Modern",
    title: {
      ko: "ARC Ezel 컬렉션",
      ja: "ARCエゼルコレクション",
      en: "ARC Ezel Collection"
    },
    tagline: {
      ko: "새로운 스타일 탐험",
      ja: "新しいスタイルの探求",
      en: "Exploring New Styles"
    },
    description: {
      ko: "ARC Ezel에서 가져온 새로운 의상 컬렉션입니다.",
      ja: "ARC Ezelから持ち込まれた新しい衣装コレクション。",
      en: "New clothing collection imported from ARC Ezel."
    },
    previewImage: "/shop/arc-ezel-collection/1779566901327-w4ff1t.png",
    price: "$15",
    gallery: ["/shop/arc-ezel-collection/1779566901327-w4ff1t.png"],
    tieredPrompts: {
      level1_clothing: "fashion outfit from arc ezel collection",
      level2_background: "modern studio setting",
      level3_camera_angle: "professional portrait angle",
      level4_lighting: "soft natural lighting",
      level5_pose: "confident fashion pose",
      level6_erotic_pose: "alluring fashion stance",
      level7_hard_complete: "complete arc ezel inspired fashion photography",
      vaultPath: "02_Notes/Visual/arc-ezel-collection"
    },
    content: {
      clothingPrompt:
        "fashion outfit from arc ezel collection, modern studio setting, professional styling",
      modelPrompt:
        "confident fashion pose, professional portrait angle, soft natural lighting",
      slideshowUrl: "https://arc.net/e/1901E6DC-C5B7-4F9F-BD21-0271E75DE8AA",
      bonusImageUrl: "/shop/arc-ezel-collection-bonus.jpg"
    }
  }
]

// 캐시 for obsidian products (메모리에서 중복 로드 방지)
const obsidianProductCache = new Map<string, ShopProduct>()

export async function getProduct(
  slug: string
): Promise<ShopProduct | undefined> {
  // 1. 정적 상품 우선 (빠름)
  const staticProduct = shopProducts.find(p => p.slug === slug)
  if (staticProduct) return staticProduct

  // 2. 캐시 확인 (중복 로드 방지)
  if (obsidianProductCache.has(slug)) {
    return obsidianProductCache.get(slug)
  }

  // 3. obsidian 폴더에서 찾기 (Gemini 등록 상품들)
  try {
    const baseUrl = typeof window === "undefined" ? "http://localhost:3000" : ""
    const response = await fetch(`${baseUrl}/obsidian/04_Products/${slug}.md`, {
      cache: "no-store"
    })
    if (response.ok) {
      const markdown = await response.text()
      const product = parseObsidianProduct(markdown, slug)
      obsidianProductCache.set(slug, product)
      return product
    }
  } catch (error) {
    console.error(`obsidian product load failed: ${slug}`, error)
  }

  return undefined
}

function parseObsidianProduct(markdown: string, slug: string): ShopProduct {
  const lines = markdown.split("\n")
  const frontmatterEnd = lines.findIndex((line, i) => i > 0 && line === "---")
  const frontmatter = lines.slice(1, frontmatterEnd).join("\n")

  // frontmatter 파싱 (간단한 방식)
  const meta: any = {}
  frontmatter.split("\n").forEach(line => {
    const [key, ...values] = line.split(":")
    if (key && values.length > 0) {
      meta[key.trim()] = values.join(":").trim()
    }
  })

  // ShopProduct 형식으로 변환
  return {
    slug,
    category: meta.category as Category,
    title: {ko: meta.title, ja: meta.title, en: meta.title},
    tagline: {
      ko: "Gemini 등록 상품",
      ja: "Gemini登録商品",
      en: "Gemini Registered"
    },
    description: {
      ko: "obsidian에서 로드됨",
      ja: "obsidianから読み込み",
      en: "Loaded from obsidian"
    },
    previewImage: meta.image || "",
    price: `$${meta.price}`,
    gallery: [meta.image || ""],
    content: {
      clothingPrompt: meta.title,
      modelPrompt: "Korean female model",
      slideshowUrl: "",
      bonusImageUrl: meta.image || ""
    },
    tieredPrompts: {
      level1_clothing: meta.title,
      level2_background: "soft prompt",
      level3_camera_angle: "camera angle",
      level4_lighting: "lighting",
      level5_pose: "pose",
      level6_erotic_pose: "erotic pose",
      level7_hard_complete: "hard complete",
      vaultPath: `obsidian/04_Products/${slug}.md`
    }
  }
}

/**
 * 전체 상품 목록 반환 (정적 + 동적 obsidian 상품)
 * Server-side에서만 사용 가능 (파일 시스템 접근)
 */
export async function getAllProducts(): Promise<ShopProduct[]> {
  const allProducts = [...shopProducts]

  // Server-side에서만 obsidian 스캔
  if (typeof window === "undefined") {
    try {
      const fs = require('fs')
      const path = require('path')
      const obsidianDir = path.join(process.cwd(), 'obsidian/04_Products')

      if (fs.existsSync(obsidianDir)) {
        const files = fs.readdirSync(obsidianDir)
        const markdownFiles = files.filter((f: string) => f.endsWith('.md'))

        for (const file of markdownFiles) {
          const slug = path.basename(file, '.md')
          // 정적 배열에 없는 상품만 추가
          if (!shopProducts.find(p => p.slug === slug)) {
            try {
              const content = fs.readFileSync(path.join(obsidianDir, file), 'utf-8')
              const product = parseObsidianProduct(content, slug)
              allProducts.push(product)
            } catch (error) {
              console.log(`Failed to parse ${slug}:`, error)
            }
          }
        }
      }
    } catch (error) {
      console.log('Obsidian scan failed:', error)
    }
  }

  return allProducts
}

/**
 * 클라이언트용: 정적 상품만 반환
 */
export function getStaticProducts(): ShopProduct[] {
  return shopProducts
}

/**
 * 개발자용: 새 obsidian 상품 감지
 * 수동 검토 없이 신규 상품만 확인
 */
export async function scanForNewProducts(): Promise<string[]> {
  try {
    // 현재 알려진 상품들
    const knownSlugs = new Set([
      ...shopProducts.map(p => p.slug),
      ...Array.from(obsidianProductCache.keys())
    ])

    // TODO: 실제 구현시 obsidian 폴더 스캔 API 추가
    console.log("Known products:", knownSlugs.size)
    return [] // placeholder
  } catch (error) {
    console.log("Scan failed:", error)
    return []
  }
}
