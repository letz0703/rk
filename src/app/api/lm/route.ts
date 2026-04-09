import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { topic, audience, duration, source, tone, characters } = await req.json()

  const characterBlock = characters?.trim()
    ? `\n\n등장인물:\n${characters}`
    : ""

  const sourceBlock = source?.trim()
    ? `\n\n참고 자료:\n${source}`
    : ""

  const prompt = `당신은 NotebookLM 동영상 개요 전문 스크립트 작가입니다.
아래 정보를 바탕으로 두 가지를 생성하세요.

[입력 정보]
- 주제: ${topic}
- 대상 시청자: ${audience}
- 동영상 길이: ${duration}분
- 톤/스타일: ${tone}${sourceBlock}${characterBlock}

---

## 1. NotebookLM 동영상 개요 스크립트

NotebookLM Audio Overview 형식에 맞는 두 진행자(Host A, Host B)의 대화 대본을 작성하세요.
- 인트로 → 핵심 섹션 3~5개 → 아웃트로 구조
- 각 섹션에 [SECTION: 제목] 태그 사용
- 자연스러운 대화 흐름, 질문과 답변 형식
- ${duration}분 분량에 맞게 작성

## 2. Chibi 캐릭터 이미지 프롬프트

등장인물별로 Chibi 스타일 AI 이미지 생성 프롬프트를 작성하세요.
각 캐릭터마다 3가지 의상 버전 프롬프트를 제공하세요.

형식:
### [캐릭터 이름]
**의상 1 (기본):** chibi style, [캐릭터 외모 설명], [의상 설명], white background, cute, high quality, detailed illustration
**의상 2 (캐주얼):** ...
**의상 3 (특별):** ...

캐릭터 정보가 없으면 주제에 어울리는 캐릭터 2명을 직접 설정하여 작성하세요.`

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: "API error" }, { status: 500 })
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}
