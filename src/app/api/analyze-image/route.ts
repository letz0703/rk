import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const BODYCOPY_PROMPT = `당신은 전문 패션 포토그래퍼이자 bodycopy 프롬프트 생성기입니다.

주어진 의상 이미지를 분석하여 정확히 9개의 화보 프롬프트를 생성해주세요.

생성 규칙:
- 1-7번: 다양한 상황과 컨셉의 기본 프롬프트 (카페, 거리, 스튜디오, 옥상, 갤러리, 계단, 사무실 등)
- 8번: 아날로그 필름 스타일 (Kodak Portra 400, 35mm film, vintage Leica 등)
- 9번: 디지털 고화질 스타일 (Sony α7R V, 24-70mm f/2.8 등 구체적 장비 명시)

각 프롬프트는:
- 의상의 구체적 설명 포함
- 장소/분위기 설정
- 조명과 카메라 설정 상세 기술
- 영어로 작성
- 50-80단어 길이

응답은 JSON 배열 형태로만 출력:
["프롬프트1", "프롬프트2", ..., "프롬프트9"]`

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "이미지가 필요합니다" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const result = await model.generateContent([
      BODYCOPY_PROMPT,
      {
        inlineData: {
          data: image,
          mimeType: mimeType
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    console.log('Gemini raw response:', text)

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*?\]/)
    if (!jsonMatch) {
      console.error('No JSON array found in response:', text)
      throw new Error("Invalid response format from Gemini")
    }

    console.log('Extracted JSON:', jsonMatch[0])
    let prompts
    try {
      prompts = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('JSON parse failed:', parseError)
      throw new Error("Invalid JSON format from Gemini")
    }

    if (!Array.isArray(prompts) || prompts.length !== 9) {
      console.error('Invalid prompts array:', prompts)
      throw new Error("Expected 9 prompts in array format")
    }

    // Validate each prompt is a non-empty string
    for (let i = 0; i < prompts.length; i++) {
      if (typeof prompts[i] !== 'string' || prompts[i].trim().length === 0) {
        throw new Error(`Invalid prompt at index ${i}: must be non-empty string`)
      }
    }

    return NextResponse.json({
      prompts: prompts
    })

  } catch (error) {
    const err = error as {
      message?: string
      status?: number
      errorInfo?: unknown
      stack?: string
    }
    console.error('Gemini API Error Details:', {
      message: err.message,
      status: err.status,
      errorInfo: err.errorInfo,
      stack: err.stack
    })

    // Fallback to mock data if Gemini fails
    const fallbackPrompts = [
      "A stylish person wearing the analyzed outfit, standing confidently in a modern office setting with natural lighting streaming through large windows, captured with professional composition and sharp focus.",
      "The same person in their elegant attire, walking through a busy city street with a confident stride, captured with shallow depth of field focusing on their silhouette against the urban backdrop.",
      "A close-up portrait of the person in their sophisticated outfit, sitting at a café table with warm ambient lighting creating a cozy atmosphere, shot with 85mm lens for natural compression.",
      "The person posing against a minimalist white backdrop, their outfit creating strong geometric lines, shot with dramatic studio lighting and high contrast to emphasize the clothing details.",
      "An outdoor fashion shot of the person in their ensemble, standing on a rooftop terrace with the city skyline in the background during golden hour, creating warm rim lighting around their silhouette.",
      "The person walking down a marble staircase in an elegant building, their outfit flowing naturally with each step, captured from a low angle to create a sense of power and elegance.",
      "A candid moment of the person laughing while adjusting their outfit, shot in a contemporary art gallery with soft, diffused lighting bouncing off white walls.",
      "Classic analog film aesthetic: the person in their timeless outfit captured on 35mm film with a vintage Leica camera, featuring rich grain, natural color tones, and the distinctive film look of Kodak Portra 400.",
      "Ultra-high definition digital capture using a Sony α7R V with 24-70mm f/2.8 lens, showcasing every detail of the person's sophisticated outfit with perfect clarity, modern post-processing, and pristine sharpness."
    ]

    return NextResponse.json({
      prompts: fallbackPrompts
    })
  }
}