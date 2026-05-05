import Link from "next/link"
import { models } from "./data"

const nationalityMap: Record<string, { flag: string; label: string }> = {
  KR: { flag: "🇰🇷", label: "한국" },
  US: { flag: "🇺🇸", label: "미국" },
  EG: { flag: "🇪🇬", label: "이집트" },
  FR: { flag: "🇫🇷", label: "프랑스" },
  GB: { flag: "🇬🇧", label: "영국" },
  JP: { flag: "🇯🇵", label: "일본" },
  CN: { flag: "🇨🇳", label: "중국" },
  IT: { flag: "🇮🇹", label: "이탈리아" },
  GR: { flag: "🇬🇷", label: "그리스" },
  RU: { flag: "🇷🇺", label: "러시아" },
}
function getNationality(code: string) {
  return nationalityMap[code] ?? { flag: "🌍", label: code }
}

export default function ModelsPage() {
  return (
    <main className="min-h-screen bg-white text-[#c10002] px-6 py-20 selection:bg-[#c10002]/10 selection:text-[#c10002]">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="group flex items-center gap-1 text-sm text-slate-400 hover:text-[#c10002] mb-10 transition-all font-medium">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Home
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tight mb-4 uppercase italic">Models</h1>
          <div className="h-1 w-20 bg-[#c10002] mb-6"></div>
          <p className="text-slate-500 text-lg font-medium">rainskiss의 독보적인 AI 모델 부티크.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {models.map(model => (
            <Link
              key={model.slug}
              href={`/models/${model.slug}`}
              className="group relative block"
            >
              {/* Card Container */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#c10002]/10 group-hover:-translate-y-2 group-hover:border-[#c10002]/20">
                {/* Image Section */}
                {model.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={model.profileImage}
                    alt={model.name}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                    <span className="text-7xl opacity-5 transition-transform duration-500 group-hover:scale-125 group-hover:opacity-10">👤</span>
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-[#c10002] border border-[#c10002]/10">
                    {getNationality(model.nationality).flag} {getNationality(model.nationality).label}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="mt-6 px-2">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black italic uppercase group-hover:text-[#c10002] transition-colors tracking-tight">
                      {model.nameKo}
                    </span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5 tracking-wider uppercase">
                      {model.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 group-hover:text-[#c10002] transition-colors">
                    EXPLORE <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-32 pt-10 border-t border-slate-100 text-center">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 RAINSKISS STUDIO. PREMIUM AI MODELING.
          </p>
        </footer>
      </div>
    </main>
  )
}
