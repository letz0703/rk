"use client";

const gems = [
  {
    href: "https://gemini.google.com/gem/45fa10ca8b41",
    emoji: "✦",
    title: "Gem Prompt",
    desc: "URL 또는 텍스트를 넣으면 포스트 글과 AI 이미지 프롬프트를 생성합니다.",
    tag: "Content",
  },
  // 새 Gem 추가 시 여기에
];

export default function GemsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">✦ Gems</h1>
          <p className="text-sm text-gray-400">Rainskiss 전용 AI 도구 모음</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gems.map((gem) => (
            <a
              key={gem.href}
              href={gem.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#141414] border border-white/10 rounded-2xl p-6 hover:border-white/30 hover:bg-[#1a1a1a] transition-all duration-200 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{gem.emoji}</span>
                <span className="text-xs text-gray-500 border border-white/10 rounded px-2 py-0.5">{gem.tag}</span>
              </div>
              <div>
                <h2 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{gem.title}</h2>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{gem.desc}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
