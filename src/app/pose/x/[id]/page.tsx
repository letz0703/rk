import Image from "next/image"
import Link from "next/link"

const grokVideos = [
  {
    id: "442995b8-50a6-4838-86d6-f4185e80c750",
    title: "Pose #1"
  }
]
export default function PoseXListPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">Pose X List</h1>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {grokVideos.map(video => {
          const thumbPath = `/posex/${video.id}.jpg`
          const grokUrl = `https://grok.com/imagine/post/${video.id}` // ✅ Grok 링크
          return (
            <li
              key={video.id}
              className="overflow-hidden rounded-xl border bg-white/5 shadow hover:shadow-lg transition"
            >
              <a
                href={grokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                {/* 썸네일 */}
                <div className="relative w-full aspect-[2/3] bg-black/10">
                  <Image
                    src={thumbPath}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                </div>

                {/* 제목 + 버튼 */}
                <div className="flex items-center justify-between p-3">
                  <span className="font-medium">{video.title}</span>
                  <span className="text-blue-600 group-hover:underline">
                    Open
                  </span>
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
