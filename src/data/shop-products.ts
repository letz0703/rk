// 🤖 자동 생성됨: 2026-05-23T20:14:12.524Z
// 이미지 스캐너로 업데이트된 제품: 3개

// 🤖 간소화됨: 2026-05-24
// white-halter-mini + beige-ribbed-mini 만 유지

export type Lang = "ko" | "ja" | "en"

export type MultiLang = {
  ko: string
  ja: string
  en: string
}

export type Category = "Street & Modern" | "Mathematical Fashion" | "Historical" | "Fantasy & Armour"

export type ShopProduct = {
  slug: string
  category: Category
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
      en: "White Halter Neck Mini Dress",
    },
    tagline: {
      ko: "청순하면서도 세련된 — 빛 속에 서다",
      ja: "清楚で洗練された — 光の中に立つ",
      en: "Pure yet sophisticated — standing in the light",
    },
    description: {
      ko: "깨끗한 화이트 컬러와 홀터넥 디자인이 어깨와 쇄골 라인을 아름답게 드러냅니다.",
      ja: "クリーンなホワイトカラーとホルターネックデザインが肩と鎖骨のラインを美しく際立たせます。",
      en: "The clean white tone and halter neckline beautifully frame the shoulders and collarbone.",
    },
    previewImage: "/shop/white-halter-mini-01.jpg",
    price: "$15",
    gallery: [
      "/shop/white-halter-mini-01.jpg",
      "/shop/white-halter-mini-02.jpg"
    ],
    tieredPrompts: {
      level1_clothing: "white halter neck mini dress, asymmetrical draping, flowing fabric, crisp details",
      level2_background: "bright minimal studio, soft shadows, clean aesthetic",
      level3_camera_angle: "full body shot, eye level, sharp focus",
      level4_lighting: "soft natural daylight, high-key lighting",
      level5_pose: "elegant standing position, one hand on hip, subtle arched back",
      level6_erotic_pose: "sensual back arch, dress fabric tension highlighting curves",
      level7_hard_complete: "Focus on the sheer gauze transparency vs the concrete shadows",
      vaultPath: "02_Notes/Visual/white-halter-mini"
    },
    content: {
      clothingPrompt: "white halter neck mini dress, asymmetrical draping, flowing fabric, crisp details, natural cotton blend, minimalist design",
      modelPrompt: "professional portrait lighting, golden hour natural light, soft shadows, confident feminine pose, elegant standing position",
      slideshowUrl: "https://www.deviantart.com/rainskiss/art/rainskiss-a-halter-1324765275",
      bonusImageUrl: "/shop/white-halter-bonus.jpg",
    },
  },
  {
    slug: "beige-ribbed-mini",
    category: "Street & Modern",
    title: {
      ko: "베이지 리브 미니 드레스",
      ja: "ベージュ リブ ミニドレス",
      en: "Beige Ribbed Mini Dress",
    },
    tagline: {
      ko: "매끄럽고 역동적인 — 일상의 우아함",
      ja: "滑らかでダイナミック — 日常のエレガンス",
      en: "Sleek and Dynamic — Everyday Elegance",
    },
    description: {
      ko: "부드러운 베이지 컬러의 리브 텍스처가 돋보이는 미니 드레스입니다.",
      ja: "柔らかいベージュカラーのリブテクスチャが際立つミニドレスです。",
      en: "A soft beige ribbed mini dress designed for dynamic movement and sleek silhouettes.",
    },
    previewImage: "/shop/beige-ribbed-mini-01.jpeg",
    price: "$15",
    gallery: [
      "/shop/beige-ribbed-mini-01.jpeg",
      "/shop/beige-ribbed-mini-02.jpeg"
    ],
    tieredPrompts: {
      level1_clothing: "summer ribbed mini dress in soft beige color, thin spaghetti straps, low plunging neckline",
      level2_background: "minimalist concrete architecture, urban outdoor setting",
      level3_camera_angle: "low angle upward shot, dynamic composition",
      level4_lighting: "warm afternoon sun, harsh architectural shadows",
      level5_pose: "dynamic low crouching pose, one knee bent up, the other leg extended",
      level6_erotic_pose: "suggestive low squat, dress stretched tight, intimate eye contact",
      level7_hard_complete: "Provocative low squat, dress stretched tight revealing form, architectural chiaroscuro",
      vaultPath: "02_Notes/Visual/beige-ribbed-mini"
    },
    content: {
      clothingPrompt: "summer ribbed mini dress in soft beige color, thin spaghetti straps, low plunging neckline, high side slit, realistic ribbed texture",
      modelPrompt: "beautiful young Korean woman in a dynamic low crouching pose, one knee bent up, the other leg extended, body slightly twisted toward camera",
      slideshowUrl: "https://www.deviantart.com/rainskiss/art/1333194158",
      bonusImageUrl: "/shop/beige-ribbed-bonus.jpg",
    },
  },
  {
    slug: "arc-ezel-collection",
    category: "Street & Modern",
    title: {
      ko: "ARC Ezel 컬렉션",
      ja: "ARCエゼルコレクション",
      en: "ARC Ezel Collection",
    },
    tagline: {
      ko: "새로운 스타일 탐험",
      ja: "新しいスタイルの探求",
      en: "Exploring New Styles",
    },
    description: {
      ko: "ARC Ezel에서 가져온 새로운 의상 컬렉션입니다.",
      ja: "ARC Ezelから持ち込まれた新しい衣装コレクション。",
      en: "New clothing collection imported from ARC Ezel.",
    },
    previewImage: "/shop/arc-ezel-collection/1779566901327-w4ff1t.png",
    price: "$15",
    gallery: [
      "/shop/arc-ezel-collection/1779566901327-w4ff1t.png"
    ],
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
      clothingPrompt: "fashion outfit from arc ezel collection, modern studio setting, professional styling",
      modelPrompt: "confident fashion pose, professional portrait angle, soft natural lighting",
      slideshowUrl: "https://arc.net/e/1901E6DC-C5B7-4F9F-BD21-0271E75DE8AA",
      bonusImageUrl: "/shop/arc-ezel-collection-bonus.jpg",
    },
  },
]

export function getProduct(slug: string): ShopProduct | undefined {
  return shopProducts.find(p => p.slug === slug)
}

export function getAllProducts(): ShopProduct[] {
  return shopProducts
}