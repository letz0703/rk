'use client';

import { useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

type ChatMessage = { role: 'user' | 'assistant'; content: string; extraInfo?: string };

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(''); // plan, node_start 상태 표시
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStatus('');
    
    // Assistant 임시 메시지 프레임 생성
    let currentAssistantChat = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const ctrl = new AbortController();

    await fetchEventSource('/api/v1/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
      signal: ctrl.signal,
      onmessage(ev) {
        const data = JSON.parse(ev.data);
        if (ev.event === 'plan') {
          setStatus(data.message);
        } else if (ev.event === 'node_start') {
          setStatus(`검색 중... (${data.step})`);
        } else if (ev.event === 'delta') {
          setStatus(''); // 상태 클리어
          currentAssistantChat += data.content;
          setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1] = { role: 'assistant', content: currentAssistantChat };
            return newArr;
          });
        } else if (ev.event === 'final_answer') {
          setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1].extraInfo = `[References]\n${data.citations}`;
            return newArr;
          });
          setIsTyping(false);
          ctrl.abort(); // 스트림 수신 종료
        }
      },
      onerror(err) {
        console.error('SSE Error:', err);
        setIsTyping(false);
        ctrl.abort();
        throw err;
      }
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border-x border-gray-200 bg-white shadow-xl">
      <header className="bg-[#c10002] text-white p-4 flex flex-col">
        <h1 className="text-xl font-bold">1972 서울 다방</h1>
        <p className="text-sm opacity-80 cursor-pointer">여전히 금밀수와 라디오극에 열광하던 그 시대...</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-black bg-[#f5f5f7]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-[#c10002] text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              {m.extraInfo && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-500 border border-dashed border-gray-300">
                  {m.extraInfo}
                </div>
              )}
            </div>
          </div>
        ))}
        {status && (
          <div className="text-center text-xs text-gray-500 animate-pulse my-2">
            ✨ {status}
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input 
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-black text-sm focus:outline-none focus:border-[#c10002]"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="1972년 그 사람에게 말을 걸어보세요..."
          disabled={isTyping}
        />
        <button 
          onClick={sendMessage}
          disabled={isTyping || !input.trim()}
          className="px-6 py-2 rounded-full bg-[#c10002] text-white font-medium hover:bg-red-800 transition disabled:bg-gray-300"
        >
          전송
        </button>
      </div>
    </div>
  );
}

// EOF Trigger
