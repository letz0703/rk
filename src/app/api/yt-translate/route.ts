import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const LANG_NAME: Record<string, string> = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
};

export async function POST(req: NextRequest) {
  const { titles, targetLang } = await req.json() as { titles: string[]; targetLang: string };

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
  }

  const langName = LANG_NAME[targetLang] ?? "English";

  const prompt = `You are a YouTube search keyword translator.
Translate or transliterate the following search keywords to ${langName} so they can be used as YouTube search queries.
Rules:
- Person names: use the standard romanization or transliteration for the target language (e.g. "이정현" → "Lee Jung-hyun" in English, "イ・ジョンヒョン" in Japanese)
- Common words: translate naturally
- If the input is already in the target language, keep it as-is
Return ONLY a JSON array of translated strings in the exact same order as the input.
Do not add explanations, numbering, or any other text.

Input: ${JSON.stringify(titles)}`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const translated: string[] = JSON.parse(jsonMatch?.[0] ?? "[]");
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ translated: titles }); // fallback
  }
}
