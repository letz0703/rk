import Link from "next/link"
import { models, type Model } from "./data"

const flagMap = { KR: "🇰🇷", US: "🇺🇸" }
const labelMap = { KR: "한국 여성", US: "미국 여성" }

export default function ModelPageContent({ model }: { model: Model }) {
  const others = models.filter((m) => m.slug !== model.slug)

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/models" className="text-sm text-gray-500 hover:text-gray-300 mb-10 inline-block">
          ← Models
        </Link>

        {/* 프로필 섹션 */}
        <div className="flex flex-col sm:flex-row gap-8 mb-14">
          <div className="flex-shrink-0 w-full sm:w-56">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              {model.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={model.profileImage}
                  alt={model.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/5 to-white/10">
                  <span className="text-6xl opacity-20">👤</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold">{model.nameKo}</h1>
              <p className="text-gray-400 text-lg mt-1">{model.name}</p>
            </div>
            <p className="text-xs text-gray-500">
              {flagMap[model.nationality]} {labelMap[model.nationality]}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">{model.bio}</p>
            <a
              href={model.deviantArtUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#05CC47] text-black font-bold text-sm hover:brightness-110 transition w-fit"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 0H9l-2.5 5H8l-7 11h6l2.5-5H8L15 0z" />
              </svg>
              DeviantArt에서 보기
            </a>
          </div>
        </div>

        {/* 갤러리 */}
        <div>
          <h2 className="text-xl font-bold mb-5">Gallery</h2>
          {model.gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {model.gallery.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-white/5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${model.name} ${i + 1}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
              <p className="text-gray-600 text-sm">이미지 준비 중입니다.</p>
            </div>
          )}
        </div>

        {/* Other Models */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <h2 className="text-xl font-bold mb-6">Other Models</h2>
          <div className="flex gap-4">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/${other.slug}`}
                className="group flex flex-col items-center gap-2 w-28"
              >
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  {other.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={other.profileImage}
                      alt={other.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/5 to-white/10">
                      <span className="text-3xl opacity-20">👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  {other.nameKo}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
