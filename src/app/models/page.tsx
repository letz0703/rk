import Link from "next/link"
import { models } from "./data"

const flagMap = { KR: "🇰🇷", US: "🇺🇸" }
const labelMap = { KR: "한국", US: "미국" }

export default function ModelsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-8 inline-block">
          ← Home
        </Link>

        <h1 className="text-4xl font-extrabold mb-2">Models</h1>
        <p className="text-gray-400 text-sm mb-12">rainskiss의 AI 모델들을 만나보세요.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {models.map((model) => (
            <Link
              key={model.slug}
              href={`/${model.slug}`}
              className="group block rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/25 hover:bg-white/10 transition"
            >
              {/* 프로필 이미지 */}
              <div className="relative w-full aspect-[3/4] bg-white/5">
                {model.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={model.profileImage}
                    alt={model.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/5 to-white/10">
                    <span className="text-5xl opacity-20">👤</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold">{model.nameKo}</span>
                  <span className="text-sm text-gray-400">/ {model.name}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {flagMap[model.nationality]} {labelMap[model.nationality]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
