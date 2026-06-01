import {NextRequest, NextResponse} from "next/server"
import {markdownLoader, generateLegalResponse} from "@/lib/loader"

interface PromptEngineRequest {
  query: string
  category?: "Admin" | "Visual" | "Audio" | "Culture"
  intent?: string
  context?: Record<string, unknown>
  intensity?: number // Flow/Grok mode indicator
  imageUrl?: string // Pinterest or direct image link
}

// Removed: VisualStep interface (7-step system deprecated)

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
    // Flow/Grok 2-step system
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

  // Flow/Grok 2단계 시스템

  // Flow/Grok 2단계 템플릿 결정 로직
  const getTemplateType = (q: string, lv: number, ctx: string[]): string => {
    const lowerQ = q.toLowerCase()
    if (
      lowerQ.includes("grok") ||
      lowerQ.includes("hard") ||
      ctx.some(c => c.includes("[Grok]"))
    )
      return "Grok"
    return "Flow"
  }

  const templateType = getTemplateType(query, intensity, vaultContext)
  const isGrok = templateType === "Grok"

  // 키워드 강화 (의상 및 포즈) - Flow/Grok 2단계 강화
  let enhancedKeywords = [
    ...enhanceClothingTerms(keywords, isGrok),
    ...enhanceMotionTerms(keywords, isGrok)
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
    reasoning: `Obsidian Master Vault의 실시간 지식(${vaultContext.length}건)과 ${templateType} 템플릿을 결합하여 최적화했습니다.`,
    analysis: imageUrl ? generatePlaceholderAnalysis(imageUrl) : undefined
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

function enhanceClothingTerms(keywords: string[], isGrok: boolean): string[] {
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

    // Flow/Grok 2단계 강화
    if (isGrok)
      return `${base}, dramatic fabric texture, bold silhouette, high-contrast lighting`
    return `${base}, soft elegant draping, natural flow`
  })
}

function enhanceMotionTerms(keywords: string[], isGrok: boolean): string[] {
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

    // Flow/Grok 2단계 동작 강화
    if (isGrok)
      return `${base}, bold dynamic posture, intense eye contact, dramatic expression`
    return `${base}, elegant graceful movement, natural expression`
  })
}

function generateVisualPrompt(
  query: string,
  templateType: string,
  keywords: string[]
): string {
  const templates = {
    Flow: `[Flow - Soft] ${query}, soft cinematic lighting, dreamy atmosphere, elegant composition, 8K resolution, ${keywords.join(", ")}`,
    Grok: `[Grok - Hard] ${query}, dramatic lighting, intense shadows, high contrast, bold composition, detailed textures, ${keywords.join(", ")}`
  }

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
