import Link from "next/link"
import {redirect} from "next/navigation"
import {getViewer, listEpisodes} from "@/lib/studiox/store"
import LogoutButton from "./LogoutButton"

export const dynamic = "force-dynamic"

export default async function XStoriesPage() {
  const viewer = await getViewer()
  if (!viewer) redirect("/studiox/login")
  const episodes = await listEpisodes(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">해결된 이야기</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-full border border-rose-500/50 px-3 py-1 text-rose-400">
            {viewer.role === "vvip" ? `VVIP · ${viewer.maxEpisode}화까지 얼굴판` : "채택 회원"}
          </span>
          <LogoutButton />
        </div>
      </div>

      {episodes.length === 0 && <p className="text-neutral-500">아직 공개된 이야기가 없습니다.</p>}

      <ul className="divide-y divide-white/10">
        {episodes.map(ep => (
          <li key={ep.no}>
            <Link href={`/studiox/stories/${ep.no}`} className="flex items-center justify-between py-4 hover:text-rose-400">
              <span>
                <span className="mr-3 font-mono text-neutral-500">{ep.no}화</span>
                {ep.title}
              </span>
              {viewer.role === "vvip" && ep.faceImage && ep.no <= viewer.maxEpisode && (
                <span className="text-xs text-rose-500">얼굴판</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
