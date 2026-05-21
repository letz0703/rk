"use client"

import Link from "next/link"

export default function HomePage() {
  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-white"
          >
            RAINSKISS
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <p className="text-[#c10002] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Mathematical Beauty · Divine Proportion
            </p>
            <h1 className="text-6xl font-black tracking-tight leading-none mb-6">
              RAINSKISS
              <br />
              <span className="text-white/30">AI Fashion</span>
            </h1>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/mix"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition border border-white/20"
            >
              Mix Advisor
            </Link>
          </div>

          {/* Hidden Shop Access */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/20 text-xs tracking-wider">
              Special collections available for authorized users
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-white/30 text-sm">
              © 2026 RAINSKISS · Mathematical Fashion Design
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
