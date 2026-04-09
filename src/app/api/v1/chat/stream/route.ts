import { NextRequest } from 'next/server';
import { search1972Knowledge } from '../../../../../../vectorstore/faiss_index';
import { buildPersonaContext } from '../../../../../../agents/core/persona';
import { checkToneAndPolicy } from '../../../../../../agents/core/dsdm';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const runtime = 'nodejs'; // FAISS 등 fs 기반 라이브러리 사용 시 Edge 런타임 불가
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // 1. 계획 전송
        sendEvent('plan', { message: '질문 의도를 분석하고 1972년 지식베이스를 검색합니다.' });

        // 2. Policy 검사 및 가이드
        const policy = checkToneAndPolicy(message);
        let finalQuery = message;
        if (policy.violation) finalQuery = policy.modifiedQuery!;

        // 3. RAG 검색 시작
        sendEvent('node_start', { step: 'FAISS Vector Search' });
        const ragContext = await search1972Knowledge(message, 3);

        // 4. Persona 조립
        const systemPrompt = buildPersonaContext(ragContext);
        const directive = policy.directive ? `\n[System Directive: ${policy.directive}]` : '';
        const finalPrompt = systemPrompt + directive;

        // 5. LLM 스트리밍 (Temperature 0.6 등 스펙 적용)
        const llm = new ChatGoogleGenerativeAI({
          model: 'gemini-1.5-pro',
          temperature: 0.6,
          topP: 1.0,
        });

        // 6. 텍스트 생성 시작
        const aiStream = await llm.stream([
          { role: 'system', content: finalPrompt },
          { role: 'user', content: finalQuery }
        ]);

        let fullAnswer = '';
        for await (const chunk of aiStream) {
          const content = chunk.content;
          fullAnswer += content;
          sendEvent('delta', { content });
        }

        // 7. 최종 답변 전송
        sendEvent('final_answer', {
          content: fullAnswer,
          citations: ragContext.substring(0, 100) + '... (FAISS Context Extract)' // 간단히 첫 100자만 인용구로 노출
        });

      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        sendEvent('error', { detail: message });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      // proxy buffering 끄기를 위한 더미 헤더 (Nginx 설정 권장)
      'X-Accel-Buffering': 'no', 
    },
  });
}
