import {NextRequest, NextResponse} from "next/server"
import {markdownLoader, generateLegalResponse} from "@/lib/loader"

interface PromptEngineRequest {
  query: string
  category?: "Admin" | "Visual" | "Audio" | "Culture"
  intent?: string
  context?: Record<string, unknown>
  intensity?: number // 1-7 level
  imageUrl?: string // Pinterest or direct image link
}

interface VisualStep {
  level: number
  promptEn: string
  promptKo: string
  magicKeywords: string[]
  pose: string
  cameraAngle: string
  lensInfo: string
  location: string
}

interface AnalysisData {
  pose: string
  background: string
  lighting: string
  colors: {name: string; hex: string}[]
  source: string
}

interface PromptEngineResponse {
  success: boolean
  result?: {
    category: string
    prompt?: string
    legalBasis?: string[]
    templates?: string[]
    reasoning: string
    steps?: VisualStep[] // Grok 7-step sequence
    analysis?: AnalysisData // Image analysis block
  }
  error?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: PromptEngineRequest = await req.json()
    const {query, category, intent, intensity, imageUrl} = body

    if (!query) {
      return NextResponse.json<PromptEngineResponse>(
        {
          success: false,
          error: "Query is required"
        },
        {status: 400}
      )
    }

    // Intent Parsing - 사용자 의도 파악
    const parsedIntent = parseUserIntent(query, intent)

    // 카테고리별 처리
    const result = await processQuery(
      query,
      parsedIntent,
      category,
      intensity,
      imageUrl
    )

    return NextResponse.json<PromptEngineResponse>({
      success: true,
      result
    })
  } catch (error) {
    console.error("Prompt Engine Error:", error)
    return NextResponse.json<PromptEngineResponse>(
      {
        success: false,
        error: "Internal server error"
      },
      {status: 500}
    )
  }
}

function parseUserIntent(
  query: string,
  explicitIntent?: string
): {
  category: "Admin" | "Visual" | "Audio" | "Culture"
  type:
    | "legal_response"
    | "creative_prompt"
    | "audio_guide"
    | "cultural_reference"
  keywords: string[]
} {
  const lowerQuery = query.toLowerCase()

  // 명시적 의도(explicitIntent)가 있을 경우 우선 처리
  if (explicitIntent === "legal_response")
    return {category: "Admin", type: "legal_response", keywords: []}
  if (explicitIntent === "creative_prompt")
    return {category: "Visual", type: "creative_prompt", keywords: []}

  // Admin 의도 감지
  if (
    lowerQuery.includes("총무") ||
    lowerQuery.includes("공금") ||
    lowerQuery.includes("인계") ||
    lowerQuery.includes("법적") ||
    lowerQuery.includes("횡령") ||
    lowerQuery.includes("책임")
  ) {
    return {
      category: "Admin",
      type: "legal_response",
      keywords: extractKeywords(query, ["총무", "공금", "인계", "책임", "법적"])
    }
  }

  // Visual 의도 감지
  if (
    lowerQuery.includes("이미지") ||
    lowerQuery.includes("프롬프트") ||
    lowerQuery.includes("비주얼") ||
    lowerQuery.includes("flow") ||
    lowerQuery.includes("grok") ||
    lowerQuery.includes("soul-sync")
  ) {
    return {
      category: "Visual",
      type: "creative_prompt",
      keywords: extractKeywords(query, [
        "이미지",
        "비주얼",
        "flow",
        "grok",
        "soul-sync"
      ])
    }
  }

  // Audio 의도 감지
  if (
    lowerQuery.includes("음악") ||
    lowerQuery.includes("suno") ||
    lowerQuery.includes("1970") ||
    lowerQuery.includes("1990")
  ) {
    return {
      category: "Audio",
      type: "audio_guide",
      keywords: extractKeywords(query, ["음악", "1970", "1990", "suno"])
    }
  }

  // 기본값
  return {
    category: "Visual",
    type: "creative_prompt",
    keywords: query.split(" ").filter(word => word.length > 1)
  }
}

async function processQuery(
  query: string,
  intent: ReturnType<typeof parseUserIntent>,
  explicitCategory?: string,
  intensity: number = 1,
  imageUrl?: string
) {
  const category =
    (explicitCategory as PromptEngineRequest["category"]) || intent.category

  switch (intent.type) {
    case "legal_response":
      return await processLegalQuery(query, intent.keywords)

    case "creative_prompt":
      return await processVisualQuery(
        query,
        intent.keywords,
        intensity,
        imageUrl
      )

    case "audio_guide":
      return await processAudioQuery(query, intent.keywords)

    default:
      return await processGeneralQuery(query, category)
  }
}

async function processLegalQuery(query: string, keywords: string[]) {
  // Gemini가 설계한 법적 논리 엔진 활용
  const legalResponse = await generateLegalResponse(query)

  if (legalResponse) {
    const knowledge = await markdownLoader.loadByCategory("Admin")
    const relevantKb = knowledge.find(kb =>
      keywords.some(keyword =>
        kb.content.toLowerCase().includes(keyword.toLowerCase())
      )
    )

    return {
      category: "Admin",
      prompt: legalResponse,
      legalBasis: relevantKb?.metadata.legalReference?.split(", ") || [],
      templates: relevantKb?.metadata.templates || [],
      reasoning: `공금.md의 법적 논리 구조를 기반으로 상황별 대응 문구를 생성했습니다. 키워드: ${keywords.join(", ")}`
    }
  }

  // 폴백 응답
  return {
    category: "Admin",
    prompt: `"${query}"에 대한 구체적인 법적 대응 문구를 찾지 못했습니다. 일반적인 원칙: 공용 자산은 공동 책임이며, 개인에게 일방적 책임 전가는 부적절합니다.`,
    reasoning: "일반적인 법적 원칙 적용"
  }
}

async function processVisualQuery(
  query: string,
  keywords: string[],
  intensity: number,
  imageUrl?: string
) {
  // 지식 베이스에서 동적 컨텍스트 로드 (Visual + Culture)
  const vaultContext = await markdownLoader.findKnowledgeByKeywords(keywords)

  // 주군의 Grok 7단계 지침이 포함된 경우 시퀀스 생성 모드 진입
  if (
    query.includes("7단계") ||
    query.toLowerCase().includes("ero fashion") ||
    intensity >= 7
  ) {
    return await processVisual7StepQuery(
      query,
      keywords,
      vaultContext,
      imageUrl
    )
  }

  // 주군의 Grok 7단계 프로젝트 철학을 반영한 템플릿 결정 로직
  const getTemplateType = (q: string, lv: number, ctx: string[]): string => {
    const lowerQ = q.toLowerCase()
    if (lv >= 7 || lowerQ.includes("soul-sync")) return "Soul-Sync"
    if (
      lv >= 5 ||
      lowerQ.includes("grok") ||
      ctx.some(c => c.includes("[Grok]"))
    )
      return "Grok"
    if (lv >= 2) return "Flow-Enhanced"
    return "Flow"
  }

  const templateType = getTemplateType(query, intensity, vaultContext)

  // 키워드 강화 (의상 및 포즈) - Gemini가 정밀 분석한 강화 키워드 사용
  let enhancedKeywords = [
    ...enhanceClothingTerms(keywords, intensity),
    ...enhanceMotionTerms(keywords, intensity)
  ]

  // Obsidian Vault의 데이터가 있다면 최우선적으로 결합
  if (vaultContext.length > 0) {
    enhancedKeywords = [...vaultContext, ...enhancedKeywords]
  }

  // ep1.md 템플릿 기반 프롬프트 생성
  const basePrompt = generateVisualPrompt(query, templateType, enhancedKeywords)

  return {
    category: "Visual",
    prompt: basePrompt,
    templates: [`${templateType} 템플릿 기반`],
    reasoning: `Obsidian Master Vault의 실시간 지식(${vaultContext.length}건)과 강도 레벨 ${intensity}/7을 결합하여 최적화했습니다.`,
    analysis: imageUrl ? generatePlaceholderAnalysis(imageUrl) : undefined
  }
}

async function processVisual7StepQuery(
  query: string,
  keywords: string[],
  vaultContext: string[],
  imageUrl?: string
) {
  const steps: VisualStep[] = []
  const locations = [
    "High-end minimalist studio",
    "High-end minimalist studio",
    "Modern luxury penthouse suite",
    "Abandoned industrial warehouse with dramatic shadows",
    "Exclusive moonlit poolside",
    "Private velvet-lined boutique room",
    "Ethereal obsidian-surfaced abstract space"
  ]

  const lenses = [
    "85mm f/1.2 prime lens",
    "50mm f/1.4 prime lens",
    "35mm f/1.4 wide lens",
    "35mm f/1.4 wide lens",
    "24mm f/1.4 ultra-wide lens",
    "50mm f/1.2 prime lens",
    "Macro 100mm f/2.8 lens"
  ]

  for (let i = 1; i <= 7; i++) {
    const intensity = i
    const location = locations[i - 1]
    const lens = lenses[i - 1]

    const enhancedKeywords = [
      ...enhanceClothingTerms(keywords, intensity),
      ...enhanceMotionTerms(keywords, intensity)
    ]

    const templateType = i >= 6 ? "Grok" : i >= 2 ? "Flow-Enhanced" : "Flow"
    const prompt = generateVisualPrompt(query, templateType, enhancedKeywords)

    // 추가 매직 키워드 주입
    const magic =
      i === 1
        ? ["fashion editorial photography", "high-end studio lighting"]
        : ["cinematic focus", "hyper-detailed skin"]

    steps.push({
      level: i,
      promptEn: prompt,
      promptKo: `${i}단계: ${query}를 기반으로 한 ${templateType} 스타일의 비주얼 제안.`,
      magicKeywords: magic,
      pose: i >= 5 ? "Provocative and daring posture" : "Elegant fashion pose",
      cameraAngle: i >= 4 ? "Low angle upward shot" : "Eye-level straight shot",
      lensInfo: lens,
      location: location
    })
  }

  return {
    category: "Visual",
    steps,
    analysis: imageUrl
      ? generatePlaceholderAnalysis(imageUrl)
      : generatePlaceholderAnalysis("text-based-context"),
    reasoning:
      "주군의 Grok 7단계 지침에 따라 최저 수위부터 단계별 수위 확장 및 비주얼 분석을 수행했습니다."
  }
}

function generatePlaceholderAnalysis(source: string) {
  return {
    pose: "인물의 자세는 비대칭적 균형을 이루며, 시선은 카메라를 강렬하게 응시함. 신체 각도는 45도 측면으로 곡선을 강조함.",
    background:
      "공간감이 느껴지는 미니멀한 환경으로, 원근감이 강조된 가구 배치가 인물을 돋보이게 함.",
    lighting:
      "좌측 상단에서 유입되는 부드러운 인공광. 하이라이트는 쇄골 라인에 집중되며 쉐도우는 부드러운 그라데이션을 형성.",
    colors: [
      {name: "Obsidian Black", hex: "#0a0a0b"},
      {name: "Pure White", hex: "#ffffff"},
      {name: "Muted Gold", hex: "#c5a059"},
      {name: "Skin Warmth", hex: "#e8c3a9"},
      {name: "Deep Shadow", hex: "#1a1311"}
    ],
    source: source
  }
}

async function processAudioQuery(query: string, keywords: string[]) {
  // music/ 폴더 기반 시대별 음원 가이드
  let era = ""
  if (keywords.includes("1970")) era = "1970s"
  else if (keywords.includes("1990")) era = "1990s"

  const audioPrompt = `[Suno AI Music Generation]
Era: ${era || "Contemporary"}
Style: Based on "${query}"
Instruments: ${era === "1970s" ? "Analog synthesizers, electric guitar, disco bass" : era === "1990s" ? "Digital samples, hip-hop beats, electronic elements" : "Modern production"}
Mood: ${extractMoodFromQuery(query)}
Duration: 3-4 minutes`

  return {
    category: "Audio",
    prompt: audioPrompt,
    templates: [`${era} 시대별 템플릿`],
    reasoning: `music/ 폴더의 ${era} 데이터를 기반으로 Suno AI 음원 생성 가이드를 작성했습니다.`
  }
}

async function processGeneralQuery(query: string, category: string) {
  return {
    category,
    prompt: `${category} 카테고리에서 "${query}"에 대한 프롬프트를 생성했습니다.`,
    reasoning: "일반적인 프롬프트 생성"
  }
}

function extractKeywords(text: string, relevantWords: string[]): string[] {
  const words = text.toLowerCase().split(/\s+/)
  return relevantWords.filter(word =>
    words.some(w => w.includes(word.toLowerCase()))
  )
}

function enhanceClothingTerms(keywords: string[], intensity: number): string[] {
  const clothingMap: Record<string, string> = {
    halter:
      "elegant sheer gauze fabric, crisp white halter neckline, asymmetrical draping",
    ribbed: "soft ribbed texture, form-fitting body-contouring silhouette",
    gauze: "delicate sheer gauze fabric with intricate folds",
    mini: "high-fashion mini skirt length, sleek and graceful figure"
  }

  return keywords.map(kw => {
    const lowerKw = kw.toLowerCase()
    const base = clothingMap[lowerKw] || kw

    // 7단계 강도에 따른 점진적 묘사 강화
    if (intensity >= 7)
      return `${base}, transcendent fabric simulation, quantum-level detail, ethereal transparency`
    if (intensity >= 5)
      return `${base}, ultra-thin transparent material, provocative silhouette, artistic undertone`
    if (intensity >= 3)
      return `${base}, form-fitting sheer texture, intricate fabric folds`
    return base
  })
}

function enhanceMotionTerms(keywords: string[], intensity: number): string[] {
  const motionMap: Record<string, string> = {
    "figure-8":
      "seamless fluid motion, continuous figure-eight trajectory, hypnotic looping movement",
    spin: "dynamic pivot spin, fabric naturally spreading through space",
    relax:
      "clean elegant pose lying relaxed on wooden platform, legs lightly apart"
  }

  return keywords.map(kw => {
    const lowerKw = kw.toLowerCase()
    const base = motionMap[lowerKw] || kw

    // 7단계 강도에 따른 점진적 동작 강화
    if (intensity >= 7)
      return `${base}, hyper-dynamic momentum, soul-piercing gaze, transcendent fluidity`
    if (intensity >= 5)
      return `${base}, bold and daring posture, intimate eye contact, evocative movement`
    if (intensity >= 3) return `${base}, elegant posture, confident expression`
    return base
  })
}

function generateVisualPrompt(
  query: string,
  templateType: string,
  keywords: string[]
): string {
  const templates = {
    Flow: `[Flow - Soft] ${query}, soft cinematic lighting, dreamy atmosphere, elegant composition, 8K resolution, ${keywords.join(", ")}`,
    "Flow-Enhanced": `[Flow - Level 2] ${query}, professional fashion photography, dynamic composition, detailed textures, soft rim lighting, ${keywords.join(", ")}`,
    Grok: `[Grok - Hard] Extreme close-up, ${query}, dramatic lighting, intense shadows, high contrast, detailed textures, ${keywords.join(", ")}`,
    "Soul-Sync": `[Soul-Sync - Special] Masterpiece capturing ${query}, Da Vinci-style precision, transcendent moment, ${keywords.join(", ")}`
  }

  // templateType(string)을 templates의 유효한 키 타입으로 캐스팅하여 인덱싱 에러 해결
  return templates[templateType as keyof typeof templates] || templates.Flow
}

function extractMoodFromQuery(query: string): string {
  const moodKeywords = {
    밝은: "bright, uplifting",
    어두운: "dark, moody",
    로맨틱: "romantic, tender",
    강렬한: "intense, powerful",
    차분한: "calm, serene"
  }

  for (const [korean, english] of Object.entries(moodKeywords)) {
    if (query.includes(korean)) {
      return english
    }
  }

  return "versatile, emotional"
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const query = url.searchParams.get("q")
  const category = url.searchParams.get("category")
  const intensity = parseInt(url.searchParams.get("intensity") || "1")

  if (!query) {
    return NextResponse.json<PromptEngineResponse>(
      {
        success: false,
        error: 'Query parameter "q" is required'
      },
      {status: 400}
    )
  }

  return POST(
    new Request(req.url, {
      method: "POST",
      body: JSON.stringify({query, category, intensity}),
      headers: {"Content-Type": "application/json"}
    }) as NextRequest
  )
}
