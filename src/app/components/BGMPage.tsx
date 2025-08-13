"use client"

import Nav from "./Nav"

export default function BGMPage() {
  const bgms = [
    {
      title: "Gentle Breeze 07",
      genre: "Nature",
      cover: "/covers/Gentle Breeze.png",
      youtube: "https://youtu.be/9sZW5qF8meM",
      download:
        "https://drive.google.com/file/d/11dy5fKzyVNZylvtbq58Hy9X-tGDXTOhi/view?usp=sharing",
      suno: "https://suno.com/playlist/e427a63e-c2e4-4df6-a5b9-b5b44bd7f5c7"
    }
  ]

  const grouped: Record<string, typeof bgms> = {}
  bgms.forEach(bgm => {
    if (!grouped[bgm.genre]) grouped[bgm.genre] = []
    grouped[bgm.genre].push(bgm)
  })

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div>
        <h1 className="text-4xl font-bold mb-10">RainsKiss Free BGM </h1>
        <Nav />
      </div>
      <div className="p-5">
        🎧 Non-commercial use allowed after subscription 🦋
        youtube.com/@rainskiss.m © 2025 rainskiss 🌈 All rights reserved by the
        creator 🫧 Commercial use (DSP uploads, monetized content, resale, paid
        apps) is strictly prohibited without written permission
      </div>

      {Object.entries(grouped).map(([genre, items]) => (
        <div key={genre} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 capitalize border-b pb-1">
            {genre} ({items.length})
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((bgm, i) => (
              <li
                key={i}
                className="border rounded-xl shadow hover:shadow-md bg-white overflow-hidden"
              >
                <img
                  src={bgm.cover}
                  alt={bgm.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-3 text-gray-700">
                    {bgm.title}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        window.open(
                          bgm.youtube,
                          "_blank",
                          "width=800,height=600,menubar=no,toolbar=no,location=no,status=no"
                        )
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Watch
                    </button>
                    <a
                      href={bgm.download}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      MP3
                    </a>
                    {bgm.suno && (
                      <a
                        href={bgm.suno}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
                      >
                        Suno
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
