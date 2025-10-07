// app/videos/page.tsx

"use client"

import Link from "next/link"

const videoList = [
  {
    id: "1WoI11SOGktxU3Gl9DQ1Z1DcoUpqGFDkc",
    title: "Teaser #1"
  },
  {
    id: "12PjnKgkZgQWLBNQTTZ73p-8GxK0kpSX6",
    title: "Main Performance"
  }
]

export default function VideoListPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🎬 Videos</h1>
      <ul className="space-y-2">
        {videoList.map(video => (
          <li key={video.id}>
            <Link
              href={`/video/${video.id}`}
              className="text-blue-600 hover:underline"
            >
              {video.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
