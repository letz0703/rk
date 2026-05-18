import { NextRequest, NextResponse } from 'next/server';
import { markdownLoader, generateLegalResponse } from '@/lib/loader';

interface PromptEngineRequest {
  query: string;
  category?: 'Admin' | 'Visual' | 'Audio' | 'Culture';
  intent?: string;
  context?: Record<string, any>;
}

interface PromptEngineResponse {
  success: boolean;
  result?: {
    category: string;
    prompt: string;
    legalBasis?: string[];
    templates?: string[];
    reasoning: string;
  };
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PromptEngineRequest = await req.json();
    const { query, category, intent, context } = body;

    if (!query) {
      return NextResponse.json<PromptEngineResponse>({
        success: false,
        error: 'Query is required'
      }, { status: 400 });
    }

    // Intent Parsing - 사용자 의도 파악
    const parsedIntent = parseUserIntent(query, intent);

    // 카테고리별 처리
    const result = await processQuery(query, parsedIntent, category);

    return NextResponse.json<PromptEngineResponse>({
      success: true,
      result
    });

  } catch (error) {
    console.error('Prompt Engine Error:', error);
    return NextResponse.json<PromptEngineResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

function parseUserIntent(query: string, explicitIntent?: string): {
  category: 'Admin' | 'Visual' | 'Audio' | 'Culture';
  type: 'legal_response' | 'creative_prompt' | 'audio_guide' | 'cultural_reference';
  keywords: string[];
} {
  const lowerQuery = query.toLowerCase();

  // Admin 의도 감지
  if (lowerQuery.includes('총무') || lowerQuery.includes('공금') ||
      lowerQuery.includes('인계') || lowerQuery.includes('법적') ||
      lowerQuery.includes('횡령') || lowerQuery.includes('책임')) {
    return {
      category: 'Admin',
      type: 'legal_response',
      keywords: extractKeywords(query, ['총무', '공금', '인계', '책임', '법적'])
    };
  }

  // Visual 의도 감지
  if (lowerQuery.includes('이미지') || lowerQuery.includes('프롬프트') ||
      lowerQuery.includes('비주얼') || lowerQuery.includes('flow') ||
      lowerQuery.includes('grok') || lowerQuery.includes('soul-sync')) {
    return {
      category: 'Visual',
      type: 'creative_prompt',
      keywords: extractKeywords(query, ['이미지', '비주얼', 'flow', 'grok', 'soul-sync'])
    };
  }

  // Audio 의도 감지
  if (lowerQuery.includes('음악') || lowerQuery.includes('suno') ||
      lowerQuery.includes('1970') || lowerQuery.includes('1990')) {
    return {
      category: 'Audio',
      type: 'audio_guide',
      keywords: extractKeywords(query, ['음악', '1970', '1990', 'suno'])
    };
  }

  // 기본값
  return {
    category: 'Visual',
    type: 'creative_prompt',
    keywords: query.split(' ').filter(word => word.length > 1)
  };
}

async function processQuery(
  query: string,
  intent: ReturnType<typeof parseUserIntent>,
  explicitCategory?: string
) {
  const category = explicitCategory as any || intent.category;

  switch (intent.type) {
    case 'legal_response':
      return await processLegalQuery(query, intent.keywords);

    case 'creative_prompt':
      return await processVisualQuery(query, intent.keywords);

    case 'audio_guide':
      return await processAudioQuery(query, intent.keywords);

    default:
      return await processGeneralQuery(query, category);
  }
}

async function processLegalQuery(query: string, keywords: string[]) {
  // Gemini가 설계한 법적 논리 엔진 활용
  const legalResponse = await generateLegalResponse(query);

  if (legalResponse) {
    const knowledge = await markdownLoader.loadByCategory('Admin');
    const relevantKb = knowledge.find(kb =>
      keywords.some(keyword => kb.content.toLowerCase().includes(keyword.toLowerCase()))
    );

    return {
      category: 'Admin',
      prompt: legalResponse,
      legalBasis: relevantKb?.metadata.legalReference?.split(', ') || [],
      templates: relevantKb?.metadata.templates || [],
      reasoning: `공금.md의 법적 논리 구조를 기반으로 상황별 대응 문구를 생성했습니다. 키워드: ${keywords.join(', ')}`
    };
  }

  // 폴백 응답
  return {
    category: 'Admin',
    prompt: `"${query}"에 대한 구체적인 법적 대응 문구를 찾지 못했습니다. 일반적인 원칙: 공용 자산은 공동 책임이며, 개인에게 일방적 책임 전가는 부적절합니다.`,
    reasoning: '일반적인 법적 원칙 적용'
  };
}

async function processVisualQuery(query: string, keywords: string[]) {
  // ep1.md 기반 Flow/Grok/Soul-Sync 템플릿 매핑
  const knowledge = await markdownLoader.loadByCategory('Visual');

  // Flow/Grok/Soul-Sync 패턴 감지
  let templateType = 'Flow'; // 기본값
  if (query.toLowerCase().includes('grok') || query.toLowerCase().includes('hard')) {
    templateType = 'Grok';
  } else if (query.toLowerCase().includes('soul-sync') || query.toLowerCase().includes('special')) {
    templateType = 'Soul-Sync';
  }

  // ep1.md 템플릿 기반 프롬프트 생성
  const basePrompt = generateVisualPrompt(query, templateType, keywords);

  return {
    category: 'Visual',
    prompt: basePrompt,
    templates: [`${templateType} 템플릿 기반`],
    reasoning: `ep1.md의 ${templateType} 템플릿을 기반으로 ${keywords.join(', ')} 요소를 적용한 프롬프트를 생성했습니다.`
  };
}

async function processAudioQuery(query: string, keywords: string[]) {
  // music/ 폴더 기반 시대별 음원 가이드
  let era = '';
  if (keywords.includes('1970')) era = '1970s';
  else if (keywords.includes('1990')) era = '1990s';

  const audioPrompt = `[Suno AI Music Generation]
Era: ${era || 'Contemporary'}
Style: Based on "${query}"
Instruments: ${era === '1970s' ? 'Analog synthesizers, electric guitar, disco bass' : era === '1990s' ? 'Digital samples, hip-hop beats, electronic elements' : 'Modern production'}
Mood: ${extractMoodFromQuery(query)}
Duration: 3-4 minutes`;

  return {
    category: 'Audio',
    prompt: audioPrompt,
    templates: [`${era} 시대별 템플릿`],
    reasoning: `music/ 폴더의 ${era} 데이터를 기반으로 Suno AI 음원 생성 가이드를 작성했습니다.`
  };
}

async function processGeneralQuery(query: string, category: string) {
  return {
    category,
    prompt: `${category} 카테고리에서 "${query}"에 대한 프롬프트를 생성했습니다.`,
    reasoning: '일반적인 프롬프트 생성'
  };
}

function extractKeywords(text: string, relevantWords: string[]): string[] {
  const words = text.toLowerCase().split(/\s+/);
  return relevantWords.filter(word =>
    words.some(w => w.includes(word.toLowerCase()))
  );
}

function generateVisualPrompt(query: string, templateType: string, keywords: string[]): string {
  const templates = {
    Flow: `[Flow - Soft] ${query}, soft cinematic lighting, dreamy atmosphere, elegant composition, 8K resolution, ${keywords.join(', ')}`,
    Grok: `[Grok - Hard] Extreme close-up, ${query}, dramatic lighting, intense shadows, high contrast, detailed textures, ${keywords.join(', ')}`,
    'Soul-Sync': `[Soul-Sync - Special] Masterpiece capturing ${query}, Da Vinci-style precision, transcendent moment, ${keywords.join(', ')}`
  };

  return templates[templateType] || templates.Flow;
}

function extractMoodFromQuery(query: string): string {
  const moodKeywords = {
    '밝은': 'bright, uplifting',
    '어두운': 'dark, moody',
    '로맨틱': 'romantic, tender',
    '강렬한': 'intense, powerful',
    '차분한': 'calm, serene'
  };

  for (const [korean, english] of Object.entries(moodKeywords)) {
    if (query.includes(korean)) {
      return english;
    }
  }

  return 'versatile, emotional';
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q');
  const category = url.searchParams.get('category');

  if (!query) {
    return NextResponse.json<PromptEngineResponse>({
      success: false,
      error: 'Query parameter "q" is required'
    }, { status: 400 });
  }

  return POST(new Request(req.url, {
    method: 'POST',
    body: JSON.stringify({ query, category }),
    headers: { 'Content-Type': 'application/json' }
  }) as NextRequest);
}