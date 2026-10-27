import Link from "next/link"
import {notFound, redirect} from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {getEpisode, getViewer} from "@/lib/studiox/store"

export const dynamic = "force-dynamic"

export default async function XStoryPage({params}: {params: Promise<{no: string}>}) {
  const viewer = await getViewer()
  if (!viewer) redirect("/studiox/login")
  const no = Number((await params).no)
  if (!Number.isInteger(no)) notFound()
  const ep = await getEpisode(no)
  if (!ep || !ep.published) notFound()

  // 얼굴판 URL은 자격이 있을 때만 HTML에 실린다 — 서버에서 고른다.
  const showFace = viewer.role === "vvip" && no <= viewer.maxEpisode && !!ep.faceImage
  const image = showFace ? ep.faceImage : ep.image

  return (
    <article className="space-y-6">
      <Link href="/studiox/stories" className="text-sm text-neutral-500 hover:text-white">← 목록</Link>
      <h1 className="text-3xl font-black">
        <span className="mr-3 font-mono text-neutral-500">{ep.no}화</span>
        {ep.title}
      </h1>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={ep.title} className="w-full rounded-lg" />
      )}
      {!showFace && ep.faceImage && (
        <p className="text-sm text-rose-400/80">
          {viewer.role === "vvip" ? "이 회차 얼굴판은 새 VVIP 비밀번호로 열립니다." : "얼굴판은 VVIP 전용입니다."}
        </p>
      )}
      <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{ep.body}</ReactMarkdown>
      </div>
    </article>
  )
}
