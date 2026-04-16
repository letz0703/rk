import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const STYLE_PROMPT = `You are an expert AI artist. Transform the provided photo into an illustration in this exact art style:

Style description:
- Semi-realistic anime character illustration
- Watercolor and oil painting mixed texture with visible painterly brushstrokes
- Warm color palette: rich reds, oranges, warm browns, muted teals and greens
- Soft diffused window lighting with warm ambient glow
- Impressionistic painterly background — loose brushwork, not photorealistic
- High-detail face and hair with flowing, dynamic strands
- Lace or fabric texture details rendered in painterly style
- Overall mood: warm, artistic, elegant — similar to WLOP or Guweiz illustration style

Instructions:
1. Keep the subject/content of the photo (person, pose, composition)
2. Completely transform the rendering style to match the description above
3. Apply painterly brushstroke texture throughout
4. Adjust colors to the warm painterly palette
5. Output a high-quality illustration`

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: "이미지를 첨부해주세요." }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! })

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            {
              text: STYLE_PROMPT,
            },
          ],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    })

    const parts = response.candidates?.[0]?.content?.parts ?? []

    for (const part of parts) {
      if (part.inlineData?.data) {
        return NextResponse.json({
          imageBase64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || "image/png",
        })
      }
    }

    const textParts = parts.filter((p) => p.text).map((p) => p.text).join("\n")
    return NextResponse.json({ error: "이미지 생성에 실패했습니다. " + textParts }, { status: 500 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Stylize API error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
