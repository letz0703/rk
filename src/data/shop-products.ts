export type Lang = "ko" | "ja" | "en"

export type MultiLang = {
  ko: string
  ja: string
  en: string
}

export type Category = "Historical" | "Street & Modern" | "Fantasy & Armour"

export type ShopProduct = {
  slug: string
  category: Category
  title: MultiLang
  tagline: MultiLang
  description: MultiLang
  stylingTips: string[]
  stylingTipsLang: { ko: string[]; ja: string[]; en: string[] }
  previewImage: string
  price: string
  gallery: string[]
  content: {
    clothingPrompt: string
    modelPrompt: string
    videoPrompts: {
      editorial: string
      iphone: string
      cinematic: string
    }
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
      ko: "깨끗한 화이트 컬러와 홀터넥 디자인이 어깨와 쇄골 라인을 아름답게 드러냅니다. 허리 크로스 드레이프 디테일이 여성스러운 실루엣을 완성하며, 미니 기장의 스커트는 발랄하고 경쾌한 분위기를 연출합니다. 자연광 아래에서 부드럽고 감성적인 무드를 완성하는 드레스입니다.",
      ja: "クリーンなホワイトカラーとホルターネックデザインが肩と鎖骨のラインを美しく際立たせます。ウエストのクロスドレープディテールが女性らしいシルエットを演出し、ミニ丈スカートが軽やかで華やかな雰囲気を作り出します。自然光の下でやわらかく感性的なムードを完成させる一枚です。",
      en: "The clean white tone and halter neckline beautifully frame the shoulders and collarbone. The cross-drape waist detail creates a refined feminine silhouette, while the mini-length skirt adds a playful, elevated energy. Designed to come alive under natural light with a soft, emotionally warm mood.",
    },
    stylingTips: [],
    stylingTipsLang: {
      ko: [
        "골드 스트랩 샌들로 화사한 분위기를 완성하세요",
        "미니멀 골드 귀걸이와 레이어드 목걸이로 포인트를 더하세요",
        "레이스 초커는 순수함과 세련됨 사이의 긴장감을 만들어냅니다",
        "클러치 또는 미니 숄더백으로 룩을 가볍게 마무리하세요",
        "야외 촬영 시 골든아워 자연광을 활용하면 드레스의 질감이 살아납니다",
      ],
      ja: [
        "ゴールドのストラップサンダルで華やかな雰囲気を完成させましょう",
        "ミニマルなゴールドピアスとレイヤードネックレスでアクセントを",
        "レースチョーカーが清楚さと洗練さの絶妙な緊張感を演出します",
        "クラッチまたはミニショルダーバッグでルックを軽やかにまとめて",
        "屋外撮影ではゴールデンアワーの自然光を活かすとドレスの質感が映えます",
      ],
      en: [
        "Pair with gold strap heeled sandals to elevate the look",
        "Add a layered gold necklace and minimal earrings for subtle luxury",
        "A lace choker creates a beautiful tension between innocence and edge",
        "Finish with a clutch or mini shoulder bag to keep the look effortless",
        "Shoot in golden hour natural light to bring out the fabric's soft texture",
      ],
    },
    previewImage: "/shop/white-halter-mini-01.jpg",
    price: "$15",
    gallery: [
      "/shop/white-halter-mini-01.jpg",
      "/shop/white-halter-mini-02.jpg",
    ],
    content: {
      clothingPrompt: "white halter neck mini dress, asymmetrical draping, flowing fabric, crisp details, natural cotton blend, minimalist design, bright minimal setting, natural lighting, full-body portrait, elegant pose, soft bokeh background, 4K editorial look",
      modelPrompt: "professional portrait lighting, golden hour natural light, soft shadows, confident feminine pose, elegant standing position, minimal background, high fashion editorial style, crisp focus on subject",
      videoPrompts: {
        editorial: "high fashion editorial style, studio lighting, dramatic poses, fabric movement, professional model walking",
        iphone: "casual smartphone video, natural movement, everyday styling, natural lighting, relatable poses",
        cinematic: "film grain, color graded, dramatic lighting, fashion film aesthetic, slow motion fabric details"
      },
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
      ko: "부드러운 베이지 컬러의 리브 텍스처가 돋보이는 미니 드레스입니다. 타이트한 핏과 스파게티 스트랩, 그리고 한쪽의 하이 슬릿 디테일이 역동적인 포즈에서도 완벽한 라인을 유지해줍니다. 자연스러운 구김과 섬세한 원단 질감이 사진에 생동감을 더합니다.",
      ja: "柔らかいベージュカラーのリブテクスチャが際立つミニドレスです。タイトなフィット感とスパゲッティストラップ、そして片側のハイスリットが、ダイナ믹なポーズでも完璧なラインを保ちます。自然なシワと繊細な生地の質감이、写真に生命力を与えます。",
      en: "A soft beige ribbed mini dress designed for dynamic movement and sleek silhouettes. Featuring thin spaghetti straps, a low plunging neckline, and a high side slit, it perfectly hugs the body while maintaining a clean, high-fashion look. The realistic ribbed texture and natural draping make it a masterpiece for photorealistic AI photography.",
    },
    stylingTips: [],
    stylingTipsLang: {
      ko: [
        "화이트 스니커즈나 캔버스 뮤즈로 경쾌한 룩을 완성하세요",
        "미니멀한 주머니나 액세서리로 포인트를 줄 수 있습니다",
        "야외 콘크리트 배경이나 미니멀한 건축물 앞에서 촬영할 때 가장 돋보입니다",
      ],
      ja: [
        "ホワイトのスニーカーやキャンバスミュールで軽やかなルックに",
        "ミニマルなアクセサリーでアクセントを加えてください",
        "屋外のコンクリート背景やミニマルな建築物の前での撮影に最適です",
      ],
      en: [
        "Pair with white canvas mules or sneakers for a fresh summer look",
        "Keep accessories minimal to focus on the dress's sleek texture",
        "Best suited for outdoor settings with minimalist concrete or architectural backgrounds",
      ],
    },
    previewImage: "/shop/beige-ribbed-mini-01.jpeg",
    price: "$15",
    gallery: [
      "/shop/beige-ribbed-mini-01.jpeg",
      "/shop/beige-ribbed-mini-02.jpeg",
    ],
    content: {
      clothingPrompt: "summer ribbed mini dress in soft beige color, thin spaghetti straps, low plunging neckline, high side slit on one leg only, realistic ribbed texture, natural creases, clean short dress silhouette",
      modelPrompt: "beautiful young Korean woman in a dynamic low crouching pose, one knee bent up, the other leg extended, body slightly twisted toward camera, joyful laughing expression, perfect anatomy, soft natural outdoor lighting, 8k, sharp focus",
      videoPrompts: {
        editorial: "high fashion editorial style, dynamic crouching poses, concrete minimalist background, sharp focus, 8k",
        iphone: "casual walk in minimalist setting, beige mini dress details, natural laughter, handheld movement",
        cinematic: "dramatic low angle shots, sunlight hitting the ribbed texture, slow motion movement, fashion film aesthetic"
      },
      slideshowUrl: "https://www.deviantart.com/rainskiss/art/1333194158",
      bonusImageUrl: "/shop/beige-ribbed-bonus.jpg",
    },
  },
]

export function getProduct(slug: string): ShopProduct | undefined {
  return shopProducts.find(p => p.slug === slug)
}
