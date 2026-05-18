import {NextRequest, NextResponse} from "next/server"

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
  return clothingMap[rawTerm.toLowerCase()] || rawTerm
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
  // 하드코딩된 테스트 데이터 (Admin 필터링 완료)
  const clothingTerms = ["halter neck", "ribbed texture", "obsidian leather"]
  const motionTerms = ["Figure-8 Motion", "Serpentine Dance", "Pivot Spin"]

  // 무작위 선택
  const selectedClothing = clothingTerms[Math.floor(Math.random() * clothingTerms.length)]
  const selectedMotion = motionTerms[Math.floor(Math.random() * motionTerms.length)]

  // 매핑 엔진 적용
  const enhancedClothing = enhanceClothingTerms(selectedClothing)
  const enhancedMotion = enhanceMotionTerms(selectedMotion)

  return {
    mustDo: {
      title: `[미래/Wealth] ${enhancedClothing} + ${enhancedMotion} 뼈대 자산화`,
      description: `"${enhancedClothing}"의 구체적 의상 재질과 "${enhancedMotion}"의 역동적인 포즈를 결합한 실무 중심 비주얼 시리즈 제작`,
      reason: "AI 품질을 저해하는 과도한 예술적 조명 대신, 실질적인 의상 디테일과 자연스러운 동작 구현에 집중",
      impact: "high"
    },
    shouldDo: {
      title: "[권장/Wellness] 1890s Belle-Époque 감성 매칭",
      description: "시대적 리듬감을 Suno AI로 구현하고, 이에 최적화된 Flow/Grok 템플릿의 시각적 리듬을 동기화",
      reason: "청각과 시각의 완벽한 일치는 사용자의 체류 시간을 40% 이상 증가시킴",
      benefit: "팬층의 감성적 몰입도 강화 및 재방문율 상승"
    },
    mustNotSkip: {
      title: "[필수/Survival] 크로스 도메인 매핑 데이터 검증",
      description: "추출된 동작 용어가 Grok Aurora 프롬프트에서 일관되게 재현되는지 1회 이상 테스트",
      consequence: "데이터 불일치 발생 시 제작 효율 급감 및 창작 흐름 단절",
      urgency: "high"
    }
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