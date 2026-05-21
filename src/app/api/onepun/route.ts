import {NextRequest, NextResponse} from "next/server"
import {markdownLoader} from "@/lib/loader"
import {GoogleGenerativeAI} from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    ""
)

/**
 * Admin/행정 노이즈 필터링 블랙리스트
 */
const ADMIN_BLACKLIST = [
  "빌라 관리",
  "건물 운영",
  "수리",
  "민원",
  "부동산 임대",
  "통장 인계",
  "삼영그린빌라",
  "세금",
  "신고",
  "계약서",
  "법무",
  "회계",
  "행정처리",
  "서류작업",
  "누수",
  "곰팡이",
  "동의서"
]

/**
 * 부정적 맥락 필터링 함수
 */
function isCleanContent(content: string): boolean {
  const lowerContent = content.toLowerCase()
  return !ADMIN_BLACKLIST.some(keyword =>
    lowerContent.includes(keyword.toLowerCase())
  )
}

interface OnePunResponse {
  date: string
  dailyActions: {
    mustDo: {
      title: string
      description: string
      reason: string
      impact: "high" | "medium" | "low"
    }
    shouldDo: {
      title: string
      description: string
      reason: string
      benefit: string
    }
    mustNotSkip: {
      title: string
      description: string
      consequence: string
      urgency: "high" | "medium" | "low"
    }
  }
  strategicInsights: string[]
}

// 의상 디테일 매핑 엔진 (P0)
function enhanceClothingTerms(rawTerm: string): string {
  const clothingMap: Record<string, string> = {
    "halter neck":
      "crisp halter neckline, asymmetrical draping, flowing fabric movement",
    "ribbed texture":
      "soft ribbed texture, form-fitting silhouette, natural cotton blend",
    "obsidian leather":
      "glossy obsidian leather texture, intricate harness detailing, sleek tactile finish"
  }

  const narrativeMap: Record<string, string> = {
    "bdsm attire":
      "high-gloss latex material, intricate leather restraints, metallic buckle accents, dominant silhouette",
    "wedding gown":
      "pristine white silk gauze, torn lace details, disheveled bridal aesthetic, high-fashion scandal mood",
    "webnovel cinematic":
      "high-end cinematic webnovel cover art style, realistic skin and fabric textures, sharp focus, consistent character trope"
  }
  return (
    clothingMap[rawTerm.toLowerCase()] ||
    narrativeMap[rawTerm.toLowerCase()] ||
    rawTerm
  )
}

// 포즈 동작 매핑 엔진 (P0)
function enhanceMotionTerms(rawTerm: string): string {
  const motionMap: Record<string, string> = {
    "Figure-8 Motion":
      "seamless fluid motion, continuous figure-eight trajectory, hypnotic looping movement",
    "Serpentine Dance":
      "sinuous undulating flow, serpentine grace through space",
    "Pivot Spin":
      "precise high-speed pivot rotation, elegant momentum-driven spinning motion"
  }
  return motionMap[rawTerm] || rawTerm
}

async function generateDailyActions(): Promise<OnePunResponse["dailyActions"]> {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

    // 지식 베이스 로드 (RAG Context)
    const [visual, culture, story] = await Promise.all([
      markdownLoader.loadByCategory("Visual"),
      markdownLoader.loadByCategory("Culture"),
      markdownLoader.loadByCategory("Story")
    ])

    const prompt = `
      당신은 rainskiss의 전략 참모 '이순신'입니다. 주군의 제국 건설을 위해 지식 베이스를 분석하여 오늘의 'onepun' 전략을 수립하십시오.

      [Context: Visual Mastery]
      ${JSON.stringify(visual).slice(0, 1000)}

      [Context: Culture Archive]
      ${JSON.stringify(culture).slice(0, 1000)}

      [원칙]
      1. 뼈대 우선: 조명(Chiaroscuro)은 배제하고, 의상(Clothing)의 질감과 포즈(Pose)의 동선을 구체적인 산문체로 묘사할 것.
      2. Admin 차단: 빌라 관리, 세금, 누수, 계약 등 행정적 잡무는 절대 언급하지 말 것.
      3. 서사적 텐션: 주군이 선호하는 NTR, Power Dynamic, 웹소설적 클리셰를 전략에 녹여낼 것.

      [출력 양식: JSON]
      {
        "mustDo": { "title": "...", "description": "...", "reason": "...", "impact": "high" },
        "shouldDo": { "title": "...", "description": "...", "reason": "...", "benefit": "..." },
        "mustNotSkip": { "title": "...", "description": "...", "consequence": "...", "urgency": "high" }
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const cleanJson = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleanJson)
  } catch (error) {
    console.error("Gemini API error, falling back to static engine:", error)

    // Fallback: 기존 정적 엔진 로직
    const seriesPool = [
      {
        title: "BDSM Attire Series",
        theme: "bdsm attire",
        target: "Tactile Fetishism"
      },
      {
        title: "Scandalous Bride",
        theme: "wedding gown",
        target: "Narrative Tension"
      },
      {
        title: "Novelpia Webnovel Style",
        theme: "webnovel cinematic",
        target: "Cinematic Character Trope Mastery"
      }
    ]
    const selectedSeries =
      seriesPool[Math.floor(Math.random() * seriesPool.length)]
    const motionTerms = ["Figure-8 Motion", "Pivot Spin", "Serpentine Dance"]
    const selectedMotion =
      motionTerms[Math.floor(Math.random() * motionTerms.length)]

    const actions = {
      mustDo: {
        title: `[Fallback] ${selectedSeries.title} 진화`,
        description: `"${enhanceClothingTerms(selectedSeries.theme)}"와 "${enhanceMotionTerms(selectedMotion)}" 결합`,
        reason: "API 장애로 인한 로컬 엔진 가동",
        impact: "high" as const
      },
      shouldDo: {
        title: "[Creative Focus] 의상 질감 디테일 심화 연구",
        description:
          "Sheer Gauze와 Silk 소재의 레이어링이 주는 시각적 텐션 분석",
        reason: "행정적 노이즈를 배제하고 순수 창작의 뼈대에 집중하기 위함",
        benefit: "비주얼 자산의 독보적 퀄리티 유지"
      },
      mustNotSkip: {
        title: "[필수/Survival] 크로스 도메인 매핑 데이터 검증",
        description:
          "동작 용어가 Grok Aurora 프롬프트에서 일관되게 재현되는지 테스트",
        consequence: "데이터 불일치 발생 시 제작 효율 급감",
        urgency: "high" as const
      }
    }

    return actions
  }
}

export async function POST(req: NextRequest) {
  try {
    const dailyActions = await generateDailyActions()

    const response: OnePunResponse = {
      date: new Date().toISOString().split("T")[0],
      dailyActions,
      strategicInsights: [
        "🎯 **DA 품질 최적화**: 시대별 댄스 아카이브 + 사진학 원리 융합으로 독보적인 AI 비주얼 DA 구축",
        "💰 **홈페이지 통합**: 프롬프트 엔진과 DA 갤러리를 홈페이지에 통합하여 사용자 경험 극대화",
        "🚀 **기술적 해자**: 의상+포즈 매핑 엔진 기반의 지식-프롬프트 변환 시스템으로 경쟁 우위 확보"
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("OnePun API Error:", error)
    return NextResponse.json(
      {error: "Failed to generate daily strategy"},
      {status: 500}
    )
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
