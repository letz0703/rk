"use client"

import {useState, useEffect, ChangeEvent, DragEvent} from "react"
import Image from "next/image"
import { addNewProduct } from "@/api/firebase"

interface AnalysisSector {
  title: string
  description: string
  alternatives: string[]
}

interface DetailedAnalysis {
  face: AnalysisSector
  clothingTop: AnalysisSector
  clothingBottom: AnalysisSector
  pose: AnalysisSector
  lightTexture: AnalysisSector
  atmosphere: AnalysisSector
  dslrSettings: AnalysisSector
  cameraAngle: AnalysisSector
  dslrModel: AnalysisSector
  accessories: AnalysisSector
  mathematicalRatios: AnalysisSector // π/φ 수학적 비율 분석
  finalPrompts: {
    eng: string
    kor: string
  }[]
}

const MOCK_ANALYSIS: DetailedAnalysis = {
  face: {
    title: "얼굴 (Face)",
    description: "정교하고 대칭적인 이목구비, 약간은 젖은 듯한 피부 질감과 몽환적인 눈빛이 강조됨.",
    alternatives: ["Sultry gaze with slightly parted lips", "Confident and sharp facial structure", "Soft, ethereal expression with dewy skin finish"]
  },
  clothingTop: {
    title: "복장 상의 (Clothing Top)",
    description: "반투명한 실크 소재의 블랙 블라우스. 빛을 받으면 미세한 광택이 흐르며 몸의 곡선을 은밀하게 드러냄. 어깨 라인이 살짝 드러나는 오프숄더 디자인으로 우아함과 관능미를 동시에 구현. 섬세한 자수 디테일이 가미되어 고급스러운 텍스처를 형성함.",
    alternatives: ["Deep V-neck sheer lace bodysuit", "Form-fitting silk corset with intricate detailing", "Cropped mohair sweater revealing collarbones"]
  },
  clothingBottom: {
    title: "복장 하의 (Clothing Bottom)",
    description: "바디라인을 완벽하게 잡아주는 하이웨이스트 펜슬 스커트. 뒷트임이 깊게 들어가 활동성과 섹시함을 강조함. 소재는 새틴 소재로 은은한 반사광이 특징이며, 인물의 하체 라인을 길고 슬림하게 연출함. 허리 부분의 벨트 포인트가 복부 라인을 더욱 돋보이게 함.",
    alternatives: ["Ultra-short leather mini skirt", "Sheer high-denier stockings with lace garter", "Skin-tight satin trousers with side slit"]
  },
  pose: {
    title: "자세 (Pose)",
    description: "허리를 약간 뒤로 젖히고 한쪽 다리를 살짝 앞으로 내밀어 전체적인 실루엣의 곡선을 극대화한 포즈.",
    alternatives: ["Reclining on a velvet sofa with one leg crossed", "Standing against a wall with an arched back", "Seated on a minimalist stool with a dynamic leg extension"]
  },
  lightTexture: {
    title: "빛 질감 (Light Texture)",
    description: "부드러운 림 라이팅(Rim light)이 인물의 실루엣을 따라 흐르며, 입체감 있는 명암 대비를 형성함.",
    alternatives: ["Dramatic Chiaroscuro lighting", "Warm sunset golden hour glow", "Moody neon backlight with soft fill light"]
  },
  atmosphere: {
    title: "분위기 (Atmosphere)",
    description: "비밀스러운 럭셔리 라운지의 차분하면서도 고혹적인 공기감.",
    alternatives: ["Dark romantic noir vibe", "High-fashion minimalist elegance", "Cyberpunk futuristic mood with damp air texture"]
  },
  dslrSettings: {
    title: "DSLR 설정 (Settings)",
    description: "얕은 심도로 배경을 부드럽게 뭉개고 피사체에 시선을 집중시킴.",
    alternatives: ["f/1.2, 1/200s, ISO 100", "f/2.8, 1/125s, ISO 400 (Grainy texture)", "f/1.8, 1/500s, ISO 50 (Ultra sharp)"]
  },
  cameraAngle: {
    title: "카메라 앵글 (Angle)",
    description: "약간의 로우 앵글로 인물의 다리 길이를 강조하고 당당한 존재감을 부여함.",
    alternatives: ["Dynamic Dutch tilt for tension", "High-angle shot looking down for vulnerability", "Wide-angle environmental shot for context"]
  },
  dslrModel: {
    title: "DSLR 기종 (Model)",
    description: "고해상도 풀프레임 바디와 최상급 렌즈의 조합.",
    alternatives: ["Canon EOS R5 + 85mm f/1.2L", "Sony A7R V + 35mm f/1.4 GM", "Fujifilm GFX100S (Medium Format)"]
  },
  accessories: {
    title: "악세서리 (Accessories)",
    description: "목선을 따라 흐르는 얇은 골드 체인과 진주 이어링.",
    alternatives: ["Black lace choker", "Statement emerald rings", "Minimalist silver anklet"]
  },
  mathematicalRatios: {
    title: "수학적 비율 (π/φ Mathematical Ratios)",
    description: "스커트 길이가 전체 신장의 φ(1.618) 비율로 설정되어 황금비 미학을 구현. 포즈의 곡선이 π 궤적을 따라 흐르며 자연스러운 회전 동작 효과 연출. 케플러 삼각형 비율(1:√φ:φ)이 전체 구도에 적용되어 수학적 완벽함을 달성.",
    alternatives: [
      "Golden ratio φ (1.618) applied to hemline-to-waist proportion",
      "Circular motion dynamics following π trajectory for natural flow",
      "Kepler triangle balance (1:√φ:φ) in overall composition",
      "Pentagon geometry (36°/18° angles) in pose positioning"
    ]
  },
  finalPrompts: [
    {
      eng: "Mathematical beauty φ (1.618) proportions, masterpiece fashion photography, full body shot from head to toe, model wearing translucent black silk off-shoulder blouse and high-waisted satin pencil skirt at golden ratio hemline, deep V-neck, intricate lace details, pose following π circular flow dynamics, luxury penthouse background, golden rim lighting positioned at φ division point, cinematic shadows, shot on Canon EOS R5, 85mm f/1.2L, divine proportion aesthetic, hyper-realistic skin texture, 8k resolution --ar 4:5",
      kor: "수학적 아름다움 φ(1.618) 비율, 걸작 패션 사진, 머리 끝부터 발끝까지 전신 샷, 황금비 스커트 길이의 반투명 블랙 실크 오프숄더 블라우스와 하이웨이스트 새틴 펜슬 스커트를 입은 모델, 깊은 V넥, 복잡한 레이스 디테일, π 원형 흐름 역학을 따르는 자세, 럭셔리 펜트하우스 배경, φ 분할점에 위치한 황금빛 림 라이팅, 영화적 그림자, Canon EOS R5로 촬영, 85mm f/1.2L, 신성한 비율 미학, 하이퍼 리얼리스틱 피부 질감, 8k 해상도"
    },
    {
      eng: "The 1.618 Collection - divine proportion aesthetic, full body editorial portrait, head to toe visible, kepler triangle proportions (1:√φ:φ) in composition, model positioned at golden ratio division, sheer lace bodysuit combined with high-denier stockings, perfect mathematical balance, circular motion dynamics following π trajectory, dramatic chiaroscuro lighting with φ-ratio color distribution, sacred geometry styling, Sony A7R V, 35mm f/1.4 GM, mathematically precise fashion design, vibrant contrast, celestial mathematical elegance --v 6.0",
      kor: "The 1.618 컬렉션 - 신성한 비율 미학, 전신 에디토리얼 포트레이트, 머리부터 발끝까지 노출, 구도에서 케플러 삼각형 비율(1:√φ:φ), 황금비 분할점에 위치한 모델, 비치는 레이스 바디수트와 스타킹 조합, 완벽한 수학적 균형, π 궤적을 따르는 원형 운동 역학, φ-비율 색상 배치의 드라마틱한 키아로스쿠로 조명, 신성한 기하학적 스타일링, Sony A7R V, 35mm f/1.4 GM, 수학적으로 정밀한 패션 디자인, 강렬한 대비, 천체의 수학적 우아함"
    }
  ]
};

export default function LookPage() {
  const [inputType, setInputType] = useState<"text" | "url" | "image">("text")
  const [inputValue, setInputValue] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [results, setResults] = useState<Array<{
    level: number
    focus: string
    eng: string
    kor: string
    removed: string
    added: string
    examples: string[]
    location: string
    meta: {
      pose: string
      angle: string
      lens: string
      keywords: string
    }
  }>>([])

  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage)
      }
    }
  }, [selectedImage])

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage)
      }
      const url = URL.createObjectURL(file)
      setSelectedImage(url)
      setInputValue(file.name)
    }
  }

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragover") setIsDragging(true)
    else if (e.type === "dragleave") setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setSelectedImage(url)
      setInputValue(file.name)
    }
  }

  const executeProtocol = async () => {
    if (!inputValue && !selectedImage) return
    setIsGenerating(true)

    setTimeout(() => {
      setAnalysis(MOCK_ANALYSIS)
      setIsGenerating(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("프롬프트가 복사되었습니다.")
  }

  const createProductFromAnalysis = async () => {
    if (!analysis) return

    setIsCreatingProduct(true)

    try {
      const timestamp = new Date().toISOString().slice(0, 10)
      const productData = {
        id: `pi-${Date.now()}`,
        title: `The 1.618 Collection - ${timestamp}`,
        category: "Mathematical Fashion",
        subcategory: "π/φ Series",
        price: 29.9, // 기본가격 × φ ≈ 30
        premiumPrice: 48.34, // 기본가격 × φ²
        description: analysis.mathematicalRatios.description,
        tags: [
          "golden ratio", "pi mathematics", "divine proportion",
          "kepler triangle", "mathematical beauty", "φ 1.618",
          "sacred geometry", "perfect balance"
        ],
        prompts: {
          english: analysis.finalPrompts[0].eng,
          korean: analysis.finalPrompts[0].kor,
          alternative: analysis.finalPrompts[1]?.eng || ""
        },
        mathematicalSpecs: {
          goldenRatio: "φ (1.618) applied to hemline proportions",
          piDynamics: "π circular flow in pose composition",
          keplerTriangle: "1:√φ:φ geometric balance",
          pentagonAngles: "36°/18° positioning for natural harmony"
        },
        technicalSpecs: {
          camera: analysis.dslrModel.description,
          lighting: analysis.lightTexture.description,
          settings: analysis.dslrSettings.description,
          angle: analysis.cameraAngle.description
        },
        createdAt: new Date().toISOString(),
        featured: true,
        status: "active"
      }

      await addNewProduct(productData)
      alert(`🔥 상품이 생성되었습니다!\n\n"${productData.title}"\n\n/shop 페이지에서 확인하실 수 있습니다.`)

    } catch (error) {
      console.error("상품 생성 오류:", error)
      alert("상품 생성 중 오류가 발생했습니다.")
    } finally {
      setIsCreatingProduct(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-mono selection:bg-zinc-800">
      <div className="max-w-3xl mx-auto px-4 py-20">
        {/* Minimal Header */}
        <div className="mb-16 space-y-2">
          <h1 className="text-2xl font-bold tracking-[0.3em] uppercase">
            Rainskiss.Ero.Fashion.v2
          </h1>
          <div className="h-px bg-zinc-800 w-full" />
          <p className="text-zinc-500 text-sm uppercase tracking-widest">
            고성능 순차적 프롬프트 엔지니어링 프로토콜
          </p>
        </div>

        {/* Selector */}
        <div className="flex mb-10 bg-zinc-950 border border-zinc-800 p-1">
          {(["text", "url", "image"] as const).map(t => (
            <button
              key={t}
              onClick={() => {
                setInputType(t)
                setResults([])
                setAnalysis(null)
              }}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                inputType === t
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="space-y-6">
          {inputType === "text" && (
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="[WAITING] ENTER DATA FOR ANALYSIS..."
              className="w-full h-32 bg-black border border-zinc-800 rounded-none p-4 text-base focus:outline-none focus:border-zinc-500 transition-colors resize-none placeholder:text-zinc-900"
            />
          )}

          {inputType === "url" && (
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="[SYSTEM] INPUT URL (PINTEREST / DIRECT LINK)..."
              className="w-full bg-black border border-zinc-800 rounded-none p-4 text-base focus:outline-none focus:border-zinc-500 placeholder:text-zinc-900"
            />
          )}

          {inputType === "image" && (
            <div
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-16 text-center transition-all cursor-pointer relative ${isDragging ? "border-white bg-zinc-900" : "border-zinc-800 hover:bg-zinc-950"}`}
            >
              {selectedImage ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={selectedImage}
                    alt="Input"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <label className="cursor-pointer">
                  <span className="text-zinc-500 text-base uppercase tracking-[0.3em] font-bold underline underline-offset-8">
                    {isDragging ? "Drop here" : "Drag & Drop Image or Click"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          )}

          <button
            onClick={executeProtocol}
            disabled={isGenerating || (!inputValue && !selectedImage)}
            className="w-full bg-zinc-100 text-black py-6 text-sm font-black uppercase tracking-[0.5em] hover:bg-white transition-all disabled:bg-zinc-900 disabled:text-zinc-700 shadow-2xl active:scale-[0.98]"
          >
            {isGenerating ? "Synthesizing..." : "Execute rainskiss Protocol"}
          </button>
        </div>

        {(isGenerating || results.length > 0) && (
          <div className="mt-32 space-y-32">
            <div className="space-y-0 border-t border-zinc-900">
              {isGenerating
                ? Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="h-24 border-b border-zinc-900 flex items-center px-4 animate-pulse"
                      >
                        <div className="w-4 h-2 bg-zinc-900 rounded" />
                      </div>
                    ))
                : results.map((step, i) => (
                    <div
                      key={i}
                      className="group border-b border-zinc-900 py-12 space-y-6 hover:bg-zinc-950/50 transition-colors px-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white text-base font-bold uppercase tracking-widest bg-zinc-800 px-4 py-2">
                          Step 0{step.level}
                        </span>
                        <button
                          onClick={() => copyToClipboard(step.eng)}
                          className="text-sm text-zinc-500 hover:text-white uppercase tracking-tighter transition-colors border border-zinc-800 px-3 py-1"
                        >
                          Copy Prompt
                        </button>
                      </div>
                      <div className="space-y-4">
                        {/* Evolution Info */}
                        <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 border border-zinc-900 text-[11px] uppercase tracking-wider mb-2">
                          <div>
                            <span className="text-red-500/70 block mb-1">
                              [-] Removed / Weakened
                            </span>
                            <span className="text-zinc-500 font-mono italic">
                              {step.removed}
                            </span>
                          </div>
                          <div className="border-l border-zinc-900 pl-4">
                            <span className="text-blue-500/70 block mb-1">
                              [+] Added / Enhanced
                            </span>
                            <span className="text-zinc-300 font-mono font-bold italic">
                              {step.added}
                            </span>
                          </div>
                        </div>

                        <div className="text-blue-400 text-sm font-bold uppercase tracking-widest">
                          Core Focus: {step.focus}
                        </div>
                        <p className="text-zinc-100 text-xl font-bold italic tracking-tight leading-relaxed">
                          {step.eng}
                        </p>
                        <p className="text-zinc-400 text-base font-light leading-relaxed">
                          {step.kor}
                        </p>
                      </div>

                      {/* Example Thumbnails */}
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        {step.examples.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-[2/3] bg-zinc-900 border border-zinc-800 overflow-hidden group/img"
                          >
                            <Image
                              src={url}
                              alt={`Example ${idx + 1}`}
                              fill
                              className="object-cover opacity-60 group-hover/img:opacity-100 transition-opacity duration-500"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-zinc-500 uppercase tracking-widest pt-8 border-t border-zinc-900/50">
                        <div className="col-span-2 text-zinc-400 mb-2 font-bold text-base">
                          <span className="text-zinc-800 mr-2">LOCATION:</span>
                          {step.location}
                        </div>
                        <div>
                          <span className="text-zinc-700 font-bold mr-2">
                            Pose:
                          </span>{" "}
                          {step.meta.pose}
                        </div>
                        <div>
                          <span className="text-zinc-500">Angle:</span>{" "}
                          {step.meta.angle}
                        </div>
                        <div>
                          <span className="text-zinc-500">Lens:</span>{" "}
                          {step.meta.lens}
                        </div>
                        <div>
                          <span className="text-zinc-500">Magic:</span>{" "}
                          {step.meta.keywords}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Image Analysis Section */}
            {!isGenerating && analysis && (
              <div className="bg-zinc-950 border border-zinc-800 p-10 space-y-12">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-white uppercase tracking-[0.5em] font-black">
                    [상세 분석 보고서]
                  </span>
                  <button
                    onClick={createProductFromAnalysis}
                    disabled={isCreatingProduct}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 text-sm font-black uppercase tracking-[0.3em] hover:from-yellow-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl active:scale-[0.95]"
                  >
                    {isCreatingProduct ? "상품 생성 중..." : "🔥 바로 상품 생성"}
                  </button>
                </div>
                <div className="grid gap-8 text-sm leading-relaxed text-zinc-400">
                  {Object.entries(analysis).map(([key, value]) => {
                    if (key === 'finalPrompts') return null;
                    const section = value as AnalysisSector;
                    return (
                      <div key={key} className="space-y-3">
                        <h4 className="text-zinc-300 uppercase font-bold tracking-widest">
                          {section.title}
                        </h4>
                        <p className="text-zinc-400">{section.description}</p>
                        <div className="space-y-1">
                          <span className="text-zinc-600 text-xs uppercase tracking-wider">대안:</span>
                          {section.alternatives.map((alt, i) => (
                            <div key={i} className="text-zinc-500 text-xs pl-4 border-l-2 border-zinc-800">
                              {alt}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Final Prompts */}
                  <div className="space-y-6 pt-8 border-t border-zinc-800">
                    <h4 className="text-zinc-300 uppercase font-bold tracking-widest">
                      최종 프롬프트
                    </h4>
                    {analysis.finalPrompts.map((prompt, i) => (
                      <div key={i} className="space-y-3 bg-zinc-900 p-6 border border-zinc-800">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 text-xs uppercase tracking-wider">
                            버전 {i + 1}
                          </span>
                          <button
                            onClick={() => copyToClipboard(prompt.eng)}
                            className="text-xs text-zinc-500 hover:text-white uppercase tracking-tighter transition-colors border border-zinc-800 px-3 py-1"
                          >
                            Copy ENG
                          </button>
                        </div>
                        <p className="text-zinc-200 text-sm">{prompt.eng}</p>
                        <p className="text-zinc-500 text-xs">{prompt.kor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
