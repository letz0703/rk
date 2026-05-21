import {NextRequest, NextResponse} from "next/server"
import {markdownLoader} from "@/lib/loader"

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
  // 지식 베이스에서 서사(Story)와 트렌드 데이터 로드
  const storyKnowledge = await markdownLoader.loadByCategory("Story")

  // 주군의 '히트 시리즈' 풀 (Obsidian 데이터가 없을 경우를 대비한 골든 풀)
  const seriesPool = [
    {
      title: "Africa Series",
      theme: "ethnic contrast",
      target: "High Contrast Visuals"
    },
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

  const enhancedTheme = enhanceClothingTerms(selectedSeries.theme)
  const enhancedMotion = enhanceMotionTerms(selectedMotion)

  const actions = {
    mustDo: {
      title: `[Series Evolution] ${selectedSeries.title}: ${selectedSeries.target}`,
      description: `"${enhancedTheme}" 테마와 "${enhancedMotion}" 포즈를 결합한 3개 이상의 숏폼 시퀀스 제작. 트렌드 키워드 'NTR' 및 'Power Dynamic' 반영.`,
      reason: `현재 Patreon에서 가장 높은 클릭률을 기록 중인 ${selectedSeries.title} 서사를 우리만의 고도화된 질감 기술로 압도해야 함`,
      impact: "high"
    },
    shouldDo: {
      title: "[Trend Sync] 사주(Log) 기반 서사 알고리즘 주입",
      description:
        "최근 '사주.md'에서 정의한 법적/윤리적 갈등 구조(인계 거부, 책임 회피 등)를 신부 시리즈의 대화 프롬프트에 적용",
      reason:
        "단순한 비주얼을 넘어 법적 공방이나 심리적 텐션이 느껴지는 텍스트가 서사의 깊이를 완성함",
      benefit: "사용자의 서사 몰입도 증가 및 댓글 반응 유도"
    },
    mustNotSkip: {
      title: "[필수/Survival] 크로스 도메인 매핑 데이터 검증",
      description:
        "추출된 동작 용어가 Grok Aurora 프롬프트에서 일관되게 재현되는지 1회 이상 테스트",
      consequence: "데이터 불일치 발생 시 제작 효율 급감 및 창작 흐름 단절",
      urgency: "high"
    }
  }

  // Admin 필터링 적용: 제목이나 설명에 블랙리스트 포함 시 기본 창작 가이드로 대체
  if (
    !isCleanContent(actions.shouldDo.title) ||
    !isCleanContent(actions.shouldDo.description)
  ) {
    actions.shouldDo = {
      title: "[Creative Focus] 의상 질감 디테일 심화 연구",
      description:
        "Sheer Gauze와 Silk 소재의 레이어링이 주는 시각적 텐션 분석 및 프롬프트화",
      reason: "행정적 노이즈를 배제하고 순수 창작의 뼈대에 집중하기 위함",
      benefit: "비주얼 자산의 독보적 퀄리티 유지"
    }
  }

  return actions
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
