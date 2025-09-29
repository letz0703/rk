import React from "react"

export default function Home() {
  const platforms = [
    {
      name: "Spotify",
      href: "https://open.spotify.com/",
      bg: "bg-[#1DB954]",
      fg: "text-black",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M12 0C5.373 0 0 5.373..." />
        </svg>
      )
    },
    {
      name: "Apple Music",
      href: "https://music.apple.com/",
      bg: "bg-black",
      fg: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M16.365 1.43..." />
        </svg>
      )
    },
    {
      name: "YouTube",
      href: "https://youtube.com/",
      bg: "bg-red-600",
      fg: "text-white",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M23.498 6.186a2.96..." />
        </svg>
      )
    }
  ]

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          RAINSKISS
        </h1>
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          The sound of rain kissing the earth, the most beautiful music in the
          world.
        </p>
      </section>

      {/* Platforms */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="text-2xl font-semibold mb-8 text-center">Listen on</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {platforms.map((p, idx) => (
            <a
              key={idx}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-3 rounded-lg p-4 ${p.bg} ${p.fg} transition transform hover:scale-105`}
            >
              {p.icon}
              <span className="text-lg font-medium">{p.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © 2025 Rainskiss. All rights reserved.
      </footer>
    </main>
  )
}
