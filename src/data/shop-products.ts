export type Lang = "ko" | "ja" | "en"

export type MultiLang = {
  ko: string
  ja: string
  en: string
}

export type ShopProduct = {
  slug: string
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
      clothingPrompt: "COMING SOON",
      modelPrompt: "COMING SOON",
      videoPrompts: {
        editorial: "COMING SOON",
        iphone: "COMING SOON",
        cinematic: "COMING SOON",
      },
      slideshowUrl: "",
      bonusImageUrl: "",
    },
  },
]

export function getProduct(slug: string): ShopProduct | undefined {
  return shopProducts.find(p => p.slug === slug)
}
