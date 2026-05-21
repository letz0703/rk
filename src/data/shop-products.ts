// 🤖 자동 생성됨: 2026-05-21T09:44:05.018Z
// 이미지 스캐너로 업데이트된 제품: 3개

export type Lang = "ko" | "ja" | "en"

export type MultiLang = {
  ko: string
  ja: string
  en: string
}

export type Category = "Historical" | "Street & Modern" | "Fantasy & Armour" | "Mathematical Fashion"

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
  cameraRecs: {
    body: string[]
    lenses: string[]
    settings: {
      iso: string[]
      aperture: string[]
      shutter: string[]
    }
  }
  y18Vault: {
    flow_master: string
    grok_master: string
    signature_master: string
  }
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
      "/shop/white-halter-mini-02.jpg"
    ],
    tieredPrompts: {
      level1_clothing: "white halter neck mini dress, asymmetrical draping, flowing fabric, crisp details, natural cotton blend, minimalist design",
      level2_background: "bright minimal studio, soft shadows, clean aesthetic",
      level3_camera_angle: "full body shot, eye level, sharp focus",
      level4_lighting: "soft natural daylight, high-key lighting",
      level5_pose: "elegant standing position, one hand on hip, subtle arched back",
      level6_erotic_pose: "sensual back arch, dress fabric tension highlighting curves",
      level7_hard_complete: "Focus on the sheer gauze transparency vs the concrete shadows. Use 'obsidian skin' mapping for the final layer.",
      vaultPath: "02_Notes/Visual/white-halter-mini"
    },
    cameraRecs: {
      body: ["Canon EOS R5", "Sony α7R V"],
      lenses: ["85mm f/1.2 L", "50mm f/1.2 GM"],
      settings: {
        iso: ["100-400", "100"],
        aperture: ["f/1.2 - f/2.8", "f/1.8"],
        shutter: ["1/200 - 1/500", "1/250"]
      }
    },
    y18Vault: {
      flow_master: "Flow-optimized soft white aesthetics with delicate fabric simulation.",
      grok_master: "Grok-hard contrast with sharp shadows and translucent details.",
      signature_master: "Masterpiece capturing the essence of pure white light."
    },
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
      "/shop/beige-ribbed-mini-02.jpeg"
    ],
    tieredPrompts: {
      level1_clothing: "summer ribbed mini dress in soft beige color, thin spaghetti straps, low plunging neckline",
      level2_background: "minimalist concrete architecture, urban outdoor setting",
      level3_camera_angle: "low angle upward shot, dynamic composition",
      level4_lighting: "warm afternoon sun, harsh architectural shadows",
      level5_pose: "dynamic low crouching pose, one knee bent up, the other leg extended",
      level6_erotic_pose: "suggestive low squat, dress stretched tight, intimate eye contact",
      level7_hard_complete: "Provocative low squat, dress stretched tight revealing form, architectural chiaroscuro.",
      vaultPath: "02_Notes/Visual/beige-ribbed-mini"
    },
    cameraRecs: {
      body: ["Sony α7 IV", "Fujifilm X-T5"],
      lenses: ["35mm f/1.4 GM", "24mm f/1.4"],
      settings: {
        iso: ["200-800", "400"],
        aperture: ["f/1.4 - f/4.0", "f/2.8"],
        shutter: ["1/500 - 1/2000", "1/1000"]
      }
    },
    y18Vault: {
      flow_master: "Beige texture harmony in soft light.",
      grok_master: "Raw power dynamic in concrete environment.",
      signature_master: "The definitive urban elegance prompt."
    },
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
  {
    slug: "black-lace-bodysuit",
    category: "Street & Modern",
    title: {
      ko: "블랙 레이스 시스루 바디수트",
      ja: "ブラックレース シースルー ボディスーツ",
      en: "Black Lace Sheer Bodysuit",
    },
    tagline: {
      ko: "칠흑의 우아함 — 그림자 속에 피어난 관능",
      ja: "漆黒のエレガンス — 影の中に咲く官能",
      en: "Obsidian Elegance — Sensuality in the Shadows",
    },
    description: {
      ko: "섬세한 플로럴 레이스 패턴과 속이 비치는 쉬어 메쉬 패널이 조화를 이루는 하이엔드 바디수트입니다. 극단적인 블랙 컬러가 인물의 도자기 같은 피부 톤을 극적으로 강조하며, 하이컷 레그 라인이 다리 길이를 무한히 확장합니다. 어두운 배경과 강렬한 대비를 이룰 때 가장 압도적인 비주얼을 선사합니다.",
      ja: "繊細なフローラルレースパターンと透け感のあるシアーメッシュパネルが調화を成すハイエンドなボディスーツです。極限のブラックカラーが人物の陶器のような肌のトーンを劇的に強調し、ハイカットのレッグラインが脚の長さを無限に伸ばします。暗い背景と強烈なコントラストを成す時、最も圧倒的なビジュアルを提供します。",
      en: "A high-end bodysuit blending intricate floral lace patterns with translucent sheer mesh panels. The extreme obsidian black dramatically emphasizes porcelain skin tones, while the high-cut leg line endlessly elongates the silhouette. It delivers the most powerful visual impact when set against dark backgrounds with intense chiaroscuro contrast.",
    },
    stylingTips: [],
    stylingTipsLang: {
      ko: ["오버사이즈 블랙 블레이저와 매치하여 시크한 룩을 연출하세요", "실버 초커로 목선에 차가운 광택을 더하세요", "칠흑 같은 어둠 속에서 한 줄기 림 라이트만 활용하여 촬영하세요"],
      ja: ["オーバーサイズのブラックブレザーと合わせて、シックなルックを演出しましょう", "シルバーチョーカーで首元にクールな輝きをプラス", "漆黒の闇の中で、一筋のリムライトだけを活用して撮影してください"],
      en: ["Pair with an oversized black blazer for a chic, powerful look", "Add a silver choker to bring a cold metallic luster to the neckline", "Shoot in total darkness using only a single rim light for maximum drama"],
    },
    previewImage: "/shop/black-lace-bodysuit-01.jpg",
    price: "$15",
    gallery: ["/shop/black-lace-bodysuit-01.jpg", "/shop/black-lace-bodysuit-02.jpg"],
    tieredPrompts: {
      level1_clothing: "Intricate black floral lace bodysuit, sheer mesh panels, delicate spaghetti straps, high-cut leg line.",
      level2_background: "Dark minimalist studio, obsidian-surfaced floors, deep shadows, industrial noir aesthetic.",
      level3_camera_angle: "Wide shot, low angle looking up, 35mm f/1.4 lens, razor-sharp focus on lace texture.",
      level4_lighting: "Extreme chiaroscuro lighting, dramatic side light, rim light highlighting porcelain skin curves.",
      level5_pose: "Commanding power pose, arched back, arms gently extended, intense soul-piercing gaze.",
      level6_erotic_pose: "Provocative arch, lace tension against skin, subtle transparency revealing body architecture.",
      level7_hard_complete: "Ultimate power dynamic: The stark contrast between ethereal porcelain skin and obsidian black lace. 8k, raw, hyper-detailed textures.",
      vaultPath: "02_Notes/Visual/black-lace-bodysuit"
    },
    cameraRecs: {
      body: ["Sony α7R V", "Canon EOS R5", "Nikon Z9"],
      lenses: ["35mm f/1.4 GM", "50mm f/1.2 L"],
      settings: {
        iso: ["100-200", "100"],
        aperture: ["f/1.2 - f/2.0", "f/1.4"],
        shutter: ["1/125 - 1/250", "1/160"]
      }
    },
    y18Vault: {
      flow_master: "Obsidian lace elegance in soft noir light.",
      grok_master: "The definitive power dynamic contrast prompt.",
      signature_master: "Imperial Vault series: Black Lace Masterpiece."
    },
    content: {
      clothingPrompt: "Intricate black floral lace bodysuit, sheer mesh panels, high-cut leg line, obsidian black tone, extreme contrast.",
      modelPrompt: "Majestic model with porcelain skin, dramatic chiaroscuro lighting, powerful presence, professional studio setting.",
      videoPrompts: {
        editorial: "High fashion cinematic movement, slow motion fabric physics, dramatic light shifts.",
        iphone: "Intimate handheld look, natural grain, close-up on lace details.",
        cinematic: "Noir film aesthetic, heavy shadows, slow panning shots, moody color grade."
      },
      slideshowUrl: "https://arc.net/e/C0DA2479-7A73-4666-B034-731BDC0F8400",
      bonusImageUrl: "/shop/black-lace-bodysuit-bonus.jpg",
    },
  },
  {
    slug: "midnight-emerald-silk",
    category: "Street & Modern",
    title: {
      ko: "미드나잇 에메랄드 실크 세트",
      ja: "ミッドナイト エメラルド シルク セット",
      en: "Midnight Emerald Silk Set",
    },
    tagline: {
      ko: "심연의 녹색 — 부드러운 실크의 역동성",
      ja: "深淵の緑 — 柔らかなシルクのダイナミ즘",
      en: "Abyssal Green — The Dynamics of Soft Silk",
    },
    description: {
      ko: "깊은 숲의 밤을 닮은 에메랄드 그린 컬러의 실크 새틴 세트입니다. 빛의 각도에 따라 유려하게 변하는 실크의 광택이 인물의 조형적 미학을 강조하며, 극단적인 명암 대비를 통해 고전 회화와 같은 깊이감을 선사합니다. 피부 위에 흐르는 액체 같은 질감이 특징입니다.",
      ja: "深い森の夜を彷彿とさせるエメラルドグリーンのシルクサテンセットです。光の角度によって流麗に変化するシルクの光沢が人物の造形美を強調し、極端な明暗対比を通じて古典絵画のような奥行きを与えます。肌の上を流れる液体のような質感が特徴です。",
      en: "A silk satin set in a deep emerald green reminiscent of a forest at midnight. The fluid luster of the silk emphasizes the sculptural aesthetics of the subject, providing a depth similar to classical paintings through extreme chiaroscuro contrast. Features a liquid-like texture flowing over the skin.",
    },
    stylingTips: [],
    stylingTipsLang: {
      ko: ["미세한 안개가 낀 어두운 배경에서 촬영하세요", "골드 주얼리로 에메랄드 톤의 고귀함을 강조하세요", "슬릿 사이로 드러나는 피부의 광택을 림 라이트로 포착하세요"],
      ja: ["微かな霧が漂う暗い背景で撮影してください", "ゴールドのジュエリーでエメラルドトーンの気品を強調しましょう", "スリットから覗く肌の光沢をリムライトで捉えてください"],
      en: ["Shoot against a dark, misty background for atmosphere", "Accentuate the emerald tones with gold jewelry for a regal look", "Capture the skin's glow through the side slit using sharp rim lighting"],
    },
    previewImage: "/shop/midnight-emerald-01.jpg",
    price: "$15",
    gallery: ["/shop/midnight-emerald-01.jpg", "/shop/midnight-emerald-02.jpg"],
    tieredPrompts: {
      level1_clothing: "Emerald green silk satin slip dress, thin adjustable straps, high side slit, minimalist luxury design.",
      level2_background: "Moody luxury suite, dark velvet curtains, moonlit balcony, deep shadows, cinematic noir setting.",
      level3_camera_angle: "Close-up portrait, 85mm f/1.2 lens, shallow depth of field, focus on the fabric's sheen and skin texture.",
      level4_lighting: "Low-key lighting, golden rim light, soft diffuse highlights on silk, dramatic chiaroscuro.",
      level5_pose: "Reclining pose on dark leather, one leg extended through the slit, graceful silhouette, intense gaze.",
      level6_erotic_pose: "Seductive arch, fabric clinging to skin, subtle transparency under direct light, evocative shadows.",
      level7_hard_complete: "Masterpiece: The absolute contrast between pale porcelain skin and deep emerald silk. 8k, hyper-realistic, liquid silk physics simulation.",
      vaultPath: "02_Notes/Visual/midnight-emerald-silk"
    },
    cameraRecs: {
      body: ["Sony α7R V", "Canon EOS R5"],
      lenses: ["85mm f/1.2 L", "50mm f/1.2 GM"],
      settings: {
        iso: ["100-400", "100"],
        aperture: ["f/1.2 - f/2.0", "f/1.4"],
        shutter: ["1/160 - 1/500", "1/200"]
      }
    },
    y18Vault: {
      flow_master: "Emerald silk harmony in soft moonlight.",
      grok_master: "High-contrast emerald noir with sharp detail.",
      signature_master: "Imperial Vault: The Emerald Seduction."
    },
    content: {
      clothingPrompt: "Emerald green silk satin slip, high side slit, liquid-like luster, deep green tones, high contrast.",
      modelPrompt: "Porcelain skin model, ethereal presence, dramatic low-key lighting, professional high-fashion look.",
      videoPrompts: {
        editorial: "Cinematic silk movement, slow motion fabric drapes, dramatic lighting shifts.",
        iphone: "Casual intimate handheld view, emerald silk details, natural skin texture.",
        cinematic: "Fashion film aesthetic, dark moody tones, slow tracking shots of fabric physics."
      },
      slideshowUrl: "https://arc.net/e/C0DA2479-7A73-4666-B034-731BDC0F8400",
      bonusImageUrl: "/shop/midnight-emerald-bonus.jpg",
    },
  },
  {
    slug: "busan-marine-elegance-1618",
    category: "Mathematical Fashion",
    title: {
      ko: "부산 마린 엘레강스 - The 1.618 컬렉션",
      ja: "釜山マリンエレガンス - The 1.618コレクション",
      en: "Busan Marine Elegance - The 1.618 Collection"
    },
    tagline: {
      ko: "수학적 완벽함이 패션과 만나는 지점",
      ja: "数学的完璧さがファッションと出会う地点",
      en: "Where Mathematical Perfection Meets Fashion"
    },
    description: {
      ko: "황금비(φ=1.618)를 적용한 프리미엄 썸머 미니 드레스. 2030 미스코리아가 선택한 부산 마린시티의 기하학적 배경과 조화를 이루는 수학적 아름다움의 결정체입니다.",
      ja: "黄金比(φ=1.618)を適用したプレミアムサマーミニドレス。2030ミスコリアが選んだ釜山マリンシティの幾何学的背景と調和する数学的美しさの結晶です。",
      en: "Premium summer mini dress designed with golden ratio (φ=1.618) proportions. A crystallization of mathematical beauty chosen by 2030 Miss Korea, harmonizing with the geometric backdrop of Busan Marine City."
    },
    stylingTips: [
      "황금비 헴라인으로 다리 길이 극대화",
      "케플러 삼각형 비율 포즈 적용",
      "π 원형 흐름 동선 활용",
      "포슬린-마린 대비 컬러 매칭"
    ],
    stylingTipsLang: {
      ko: [
        "황금비 헴라인으로 다리 길이 극대화",
        "케플러 삼각형 비율 포즈 적용",
        "π 원형 흐름 동선 활용",
        "포슬린-마린 대비 컬러 매칭"
      ],
      ja: [
        "黄金比ヘムラインで脚の長さを最大化",
        "ケプラー三角形比率ポーズ適用",
        "π円形フロー動線活用",
        "ポーセリン-マリンコントラストカラーマッチング"
      ],
      en: [
        "Maximize leg length with φ-ratio hemline",
        "Apply Kepler triangle proportion poses",
        "Utilize π circular flow movement",
        "Porcelain-marine contrast color matching"
      ]
    },
    previewImage: "/shop/busan-marine-elegance-1618/1779355672448-nkdv1l.jpeg",
    price: "$48.34",
    gallery: [
      "/shop/busan-marine-elegance-1618/1779355672448-nkdv1l.jpeg",
      "/shop/busan-marine-elegance-1618/1779355689415-lqsc6d.jpeg"
    ],
    tieredPrompts: {
      level1_clothing: "pale yellow summer mini dress, φ (1.618) proportioned hemline, fine floral pattern, elegant scoop neckline, A-line silhouette, The 1.618 Collection signature",
      level2_background: "Haeundae Beach promenade, granite stone perspective lines, turquoise ocean, Marine City skyline, clean summer sky, geometric urban architecture",
      level3_camera_angle: "centered eye-level full shot, golden spiral positioning, Kepler triangle proportions, vertical structural alignment, no headroom composition",
      level4_lighting: "bright mid-afternoon sunlight, crisp geometric shadows, soft fill light, specular reflections from skyscrapers, natural rim lighting",
      level5_pose: "fluid walking motion toward camera, φ-line trajectory, weight shift forward, natural smile, authentic gaze, structured bag carry",
      level6_erotic_pose: "sophisticated high-fashion intimacy, direct eye contact, coastal breeze hair movement, lightweight fabric silhouette tracing",
      level7_hard_complete: "Mathematical beauty φ (1.618) proportions, 2030 Miss Korea walking Haeundae promenade, yellow floral mini dress, porcelain vs marine contrast, Arri Alexa 65, 65mm f/2.2, divine proportion aesthetic, celestial mathematical elegance",
      vaultPath: "02_Notes/Mathematical/busan-marine-elegance"
    },
    cameraRecs: {
      body: ["Arri Alexa 65", "Hasselblad H6D-100c", "Phase One XF IQ4 150MP"],
      lenses: ["Hasselblad HC 80mm f/2.2", "Schneider Kreuznach 55mm f/2.8", "Leica Thalia 70mm f/1.8"],
      settings: {
        iso: ["64", "100"],
        aperture: ["f/2.2", "f/2.8"],
        shutter: ["1/2000s", "1/4000s"]
      }
    },
    y18Vault: {
      flow_master: "Soft mathematical elegance with golden ratio proportions and gentle coastal atmosphere.",
      grok_master: "Sharp geometric contrast between organic beauty and architectural precision, φ-enhanced visual impact.",
      signature_master: "Masterpiece synthesis of divine proportion aesthetics and modern Korean coastal luxury."
    },
    content: {
      clothingPrompt: "pale yellow summer mini dress with φ (1.618) proportioned hemline, fine floral pattern, elegant scoop neckline, A-line silhouette, mathematical perfection, The 1.618 Collection signature design",
      modelPrompt: "2030 Miss Korea winner, porcelain skin tone, soft natural smile, authentic gaze, walking motion following φ-line trajectory, coastal promenade setting",
      videoPrompts: {
        editorial: "Mathematical fashion cinematography, golden ratio compositions, architectural contrast, luxury coastal editorial",
        iphone: "Natural walking motion, summer dress movement, authentic smile, coastal background, φ-proportioned framing",
        cinematic: "Arri Alexa aesthetic, divine proportion cinematography, mathematical beauty in motion, coastal architectural harmony"
      },
      slideshowUrl: "https://example.com/busan-marine-elegance-slideshow",
      bonusImageUrl: "/shop/busan-marine-elegance-bonus.jpg"
    }
  },
  {
    slug: "coastal-elegance-phi",
    category: "Mathematical Fashion",
    title: {
      ko: "코스탈 엘레강스 φ - 도심 해안 컬렉션",
      ja: "コースタルエレガンス φ - 都心海岸コレクション",
      en: "Coastal Elegance φ - Urban Waterfront Collection"
    },
    tagline: {
      ko: "도시와 바다가 만나는 φ 비율의 완벽함",
      ja: "都市と海が出会うφ比率の完璧さ",
      en: "Perfect φ Proportions Where City Meets Sea"
    },
    description: {
      ko: "2030 미스코리아 김민지가 선택한 크림 컬러 φ-프로포션 미니 드레스. 도심 해안 프롬나드에서 자연스러운 걸음걸이로 황금비의 우아함을 구현하는 수학적 패션의 새로운 지평입니다.",
      ja: "2030ミスコリア キム・ミンジが選んだクリームカラーφ-プロポーション ミニドレス。都心海岸プロムナードで自然な歩行で黄金比の優雅さを具現化する数学的ファッションの新地平です。",
      en: "Cream-colored φ-proportion mini dress chosen by 2030 Miss Korea Kim Min-ji. A new horizon in mathematical fashion that embodies golden ratio elegance through natural walking grace on urban coastal promenades."
    },
    stylingTips: [
      "φ 비율 헴라인으로 완벽한 다리 비율 연출",
      "π 다이나믹 걸음걸이로 자연스러운 우아함",
      "도심-해안 대비로 기하학적 조화 극대화",
      "크림 톤으로 포슬린 피부와 완벽 매칭"
    ],
    stylingTipsLang: {
      ko: [
        "φ 비율 헴라인으로 완벽한 다리 비율 연출",
        "π 다이나믹 걸음걸이로 자연스러운 우아함",
        "도심-해안 대비로 기하학적 조화 극대화",
        "크림 톤으로 포슬린 피부와 완벽 매칭"
      ],
      ja: [
        "φ比率ヘムラインで完璧な脚比率演出",
        "πダイナミック歩行で自然な優雅さ",
        "都心-海岸コントラストで幾何学的調和最大化",
        "クリームトーンでポーセリン肌と完璧マッチング"
      ],
      en: [
        "Perfect leg proportions with φ-ratio hemline",
        "Natural elegance through π dynamic walking",
        "Maximize geometric harmony with urban-coastal contrast",
        "Perfect porcelain skin match with cream tones"
      ]
    },
    previewImage: "/shop/busan-marine-elegance-1618/1779355672448-nkdv1l.jpeg",
    price: "$52.88",
    gallery: [
      "/shop/busan-marine-elegance-1618/1779355672448-nkdv1l.jpeg",
      "/shop/busan-marine-elegance-1618/1779355689415-lqsc6d.jpeg",
      "/shop/beige-ribbed-mini-01.jpeg"
    ],
    tieredPrompts: {
      level1_clothing: "cream sleeveless mini dress, φ-proportioned hemline, textured pattern, scoop neckline, fitted bodice, A-line flare, cotton-silk blend, mathematical precision silhouette",
      level2_background: "coastal promenade, geometric stone paving, modern city skyline backdrop, waterfront setting, urban-nature balance, φ division architectural positioning",
      level3_camera_angle: "medium full shot, eye level, golden spiral composition, natural walking motion capture, horizontal framing, geometric depth",
      level4_lighting: "bright natural daylight, even illumination, soft shadows, cream dress texture enhancement, skin tone luminosity, architectural rim lighting",
      level5_pose: "natural walking stride mid-motion, 1:√φ:φ proportional balance, relaxed shoulders, structured handbag carry, authentic confidence, mathematical grace",
      level6_erotic_pose: "sophisticated urban elegance, natural walking confidence, φ curve dress movement, architectural precision meets organic feminine grace",
      level7_hard_complete: "Divine proportion aesthetics with Korean coastal luxury, cream φ-cut mini dress against geometric urban skyline, π dynamic walking motion, golden ratio composition, The 1.618 Collection pinnacle of mathematical feminine elegance",
      vaultPath: "02_Notes/Mathematical/coastal-elegance-phi"
    },
    cameraRecs: {
      body: ["Canon EOS R5", "Sony α7R V", "Fujifilm GFX100S"],
      lenses: ["Canon RF 85mm f/1.2L", "Sony FE 85mm f/1.4 GM", "Fujifilm GF 110mm f/2"],
      settings: {
        iso: ["100", "200"],
        aperture: ["f/1.4", "f/2.0"],
        shutter: ["1/500s", "1/1000s"]
      }
    },
    y18Vault: {
      flow_master: "Soft coastal elegance with φ proportions and gentle urban-waterfront atmosphere harmonizing mathematical precision.",
      grok_master: "Sharp geometric contrast between cream dress elegance and concrete urban architecture, φ-enhanced natural beauty.",
      signature_master: "Masterpiece fusion of divine mathematical proportions with effortless Korean coastal sophistication and urban luxury."
    },
    content: {
      clothingPrompt: "cream sleeveless mini dress with φ-proportioned hemline, textured pattern, scoop neckline, fitted bodice with A-line flare, mathematical precision silhouette, urban coastal elegance",
      modelPrompt: "2030 Miss Korea Kim Min-ji, natural walking confidence, authentic smile, coastal promenade setting, structured handbag, φ-balanced pose composition",
      videoPrompts: {
        editorial: "Mathematical fashion cinematography, coastal urban elegance, φ proportion dynamics, architectural contrast, luxury Korean waterfront editorial",
        iphone: "Natural walking motion, cream dress movement, authentic coastal confidence, urban skyline background, φ-framed composition",
        cinematic: "Urban coastal luxury aesthetic, divine proportion cinematography, mathematical elegance in motion, Korean architectural harmony"
      },
      slideshowUrl: "https://example.com/coastal-elegance-phi-slideshow",
      bonusImageUrl: "/shop/white-halter-mini-02.jpg"
    }
  },
]

export function getProduct(slug: string): ShopProduct | undefined {
  return shopProducts.find(p => p.slug === slug)
}
