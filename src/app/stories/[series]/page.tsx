import Link from "next/link"
import { notFound } from "next/navigation"
import AgeGate from "@/components/AgeGate"
import { getSeries, series as allSeries } from "../stories-data"

export function generateStaticParams() {
  return allSeries.map(s => ({ series: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }) {
  const s = getSeries((await params).series)
  return { title: s ? `${s.title} — RAINSKISS` : "RAINSKISS" }
}

export default async function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const s = getSeries((await params).series)
  if (!s) notFound()

  return (
    <AgeGate>
      <main className="min-h-screen bg-white px-6 py-20 text-[#c10002]">
        <div className="mx-auto max-w-3xl">
          <Link href="/stories" className="mb-12 inline-block text-sm font-medium text-slate-400 transition hover:text-[#c10002]">
            ← Stories
          </Link>

          <div className="mb-14 flex flex-col gap-8 sm:flex-row">
            {s.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.cover} alt={s.title} className="aspect-[3/4] w-full rounded-3xl object-cover shadow-xl sm:w-56" />
            )}
            <div className="flex flex-col justify-end">
              <h1 className="mb-3 text-5xl font-black italic uppercase leading-none tracking-tighter">{s.title}</h1>
              <p className="text-lg text-slate-600">{s.tagline}</p>
            </div>
          </div>

          <ol className="divide-y divide-slate-100 border-y border-slate-100">
            {s.episodes.map((ep, i) => (
              <li key={ep.slug}>
                <Link href={`/stories/${s.slug}/${ep.slug}`} className="group flex items-baseline gap-6 py-5">
                  <span className="w-8 text-xs font-black text-slate-300">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-lg font-bold text-slate-800 transition group-hover:text-[#c10002]">{ep.title}</span>
                  <span className="text-xs text-slate-300">{ep.publishedAt}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </AgeGate>
  )
}
