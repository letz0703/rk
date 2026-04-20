import { NextRequest, NextResponse } from "next/server"

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

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    const model = "gemini-3.1-flash-image-preview"
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inline_data: {
                mime_type: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { text: STYLE_PROMPT },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: JSON.stringify(data.error ?? data) }, { status: res.status })
    }

    const parts = data.candidates?.[0]?.content?.parts ?? []

    for (const part of parts) {
      if (part.inline_data?.data) {
        return NextResponse.json({
          imageBase64: part.inline_data.data,
          mimeType: part.inline_data.mime_type || "image/png",
        })
      }
    }

    const textParts = parts.filter((p: { text?: string }) => p.text).map((p: { text?: string }) => p.text).join("\n")
    return NextResponse.json({ error: "이미지 생성 실패: " + textParts }, { status: 500 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Stylize API error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
