import Link from "next/link"
import { notFound } from "next/navigation"
import { readFileSync } from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import AgeGate from "@/components/AgeGate"
import ThemeSong from "@/components/ThemeSong"
import { getEpisode, series as allSeries } from "../../stories-data"

// [[wip : 제안]] = 센 장면 자리. 안의 제안 문구는 공개하지 않고 DA 잠금 상자로 바꾼다.
const WIP_MARK = "WIP_SCENE_LOCKED"
const hideWipScenes = (md: string) => md.replace(/\[\[\s*wip[\s\S]*?\]\]/gi, `\n\n${WIP_MARK}\n\n`)

// 원문은 이 함수 밖으로 나가지 않는다(개발 모드 디버그 정보에 원문이 실리는 것 방지)
async function loadPublicText(seriesSlug: string, epSlug: string): Promise<string | null> {
  try {
    const raw = readFileSync(path.join(process.cwd(), "content/stories", seriesSlug, `${epSlug}.md`), "utf-8")
    return hideWipScenes(raw)
  } catch {
    return null
  }
}

type Params = { params: Promise<{ series: string; episode: string }> }

export function generateStaticParams() {
  return allSeries.flatMap(s => s.episodes.map(ep => ({ series: s.slug, episode: ep.slug })))
}

export async function generateMetadata({ params }: Params) {
  const { series, episode } = await params
  const found = getEpisode(series, episode)
  return { title: found ? `${found.episode.title} — ${found.series.title}` : "RAINSKISS" }
}

export default async function EpisodePage({ params }: Params) {
  const { series: seriesSlug, episode: epSlug } = await params
  const found = getEpisode(seriesSlug, epSlug)
  if (!found) notFound()
  const { series, episode, prev, next } = found

  const text = await loadPublicText(series.slug, episode.slug)
  if (text === null) notFound()

  const song = episode.themeSong ?? series.themeSong
  const daUrl = episode.daUrl ?? series.daUrl

  return (
    <AgeGate>
      <main className="min-h-screen bg-white px-6 pb-40 pt-20 text-slate-800">
        <article className="mx-auto max-w-2xl">
          <Link href={`/stories/${series.slug}`} className="mb-12 inline-block text-sm font-medium text-slate-400 transition hover:text-[#c10002]">
            ← {series.title}
          </Link>

          <header className="mb-12">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#c10002]">{series.title}</p>
            <h1 className="text-5xl font-black italic leading-none tracking-tighter text-[#c10002]">{episode.title}</h1>
            {episode.heroine && <p className="mt-4 text-sm font-bold uppercase tracking-widest text-slate-400">{episode.heroine}</p>}
          </header>

          {episode.hero && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={episode.hero} alt={episode.title} className="mb-12 w-full rounded-3xl shadow-xl" />
          )}

          <div className="font-serif text-lg leading-[1.9] [&_em]:text-slate-600 [&_h2]:mb-6 [&_h2]:mt-14 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#c10002] [&_hr]:my-12 [&_hr]:border-slate-200 [&_img]:my-10 [&_img]:w-full [&_img]:rounded-2xl [&_p]:mb-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) =>
                  children === WIP_MARK ? <LockedScene daUrl={daUrl} /> : <p>{children}</p>,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>

          {daUrl && (
            <a
              href={daUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-16 block rounded-3xl bg-[#c10002] px-8 py-6 text-center text-white shadow-xl shadow-[#c10002]/20 transition hover:brightness-110"
            >
              <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Uncensored gallery</span>
              <span className="text-lg font-black uppercase tracking-widest">See her on DeviantArt ↗</span>
            </a>
          )}

          <nav className="mt-16 flex justify-between gap-4 border-t border-slate-100 pt-8 text-sm font-bold">
            {prev ? (
              <Link href={`/stories/${series.slug}/${prev.slug}`} className="text-slate-400 transition hover:text-[#c10002]">← {prev.title}</Link>
            ) : <span />}
            {next ? (
              <Link href={`/stories/${series.slug}/${next.slug}`} className="text-right text-[#c10002] transition hover:brightness-125">{next.title} →</Link>
            ) : (
              <span className="text-slate-300">Next episode coming soon</span>
            )}
          </nav>
        </article>
        {song && <ThemeSong url={song.url} title={song.title} />}
      </main>
    </AgeGate>
  )
}

function LockedScene({ daUrl }: { daUrl?: string }) {
  const box = (
    <span className="my-10 block rounded-2xl border-2 border-dashed border-[#c10002]/30 bg-[#c10002]/5 px-6 py-8 text-center font-sans">
      <span className="mb-2 block text-2xl">🔞</span>
      <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#c10002]">Scene continues on DeviantArt</span>
      {daUrl && <span className="mt-2 block text-sm font-bold text-[#c10002]">Read the full scene ↗</span>}
    </span>
  )
  return daUrl ? (
    <a href={daUrl} target="_blank" rel="noopener noreferrer" className="block no-underline transition hover:brightness-110">{box}</a>
  ) : box
}
