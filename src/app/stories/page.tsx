import Link from "next/link"
import AgeGate from "@/components/AgeGate"
import { series } from "./stories-data"

export const metadata = { title: "Stories — RAINSKISS" }

export default function StoriesPage() {
  return (
    <AgeGate>
      <main className="min-h-screen bg-white px-6 py-20 text-[#c10002]">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">RAINSKISS</p>
          <h1 className="mb-14 text-6xl font-black italic uppercase tracking-tighter">Stories</h1>

          {series.length === 0 ? (
            <p className="text-sm font-bold uppercase tracking-widest text-slate-300">Coming soon</p>
          ) : (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {series.map(s => (
                <Link key={s.slug} href={`/stories/${s.slug}`} className="group">
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-xl shadow-slate-200/50">
                    {s.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.cover} alt={s.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tight">{s.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{s.tagline}</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-300">{s.episodes.length} episodes</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </AgeGate>
  )
}
