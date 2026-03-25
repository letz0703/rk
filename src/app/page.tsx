import Image from "next/image"
import Link from "next/link"
import HeaderAuth from "./components/HeaderAuth"

export default function Page() {
  return (
    <div className="bg-gray-900 text-white">
      {/* HERO 배너 */}
      <div className="relative w-full h-[70vh]">
        <Image
          src="/hero.jpg"
          alt="hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/30">
          <h1 className="text-5xl font-extrabold text-red-600 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]">
            RAINSKISS
          </h1>
          <p className="mt-2 text-white text-lg font-light drop-shadow-[1px_1px_3px_rgba(0,0,0,0.7)]">
            The sound of rain kissing the earth,
            <br />
            the most beautiful music in the world.
          </p>
        </div>
        {/* 우상단 인증 버튼 */}
        <div className="absolute top-4 right-4">
          <HeaderAuth />
        </div>
      </div>

      {/* 본문 */}
      <main className="flex flex-col items-center text-center px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 drop-shadow-sm">
          Perfect Volume for next Generation, 100 Volume – Zero Loudness
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
          Please introduce the timeless songs you&apos;ve lived with all your
          life.
          <br />
          <span className="text-orange-400 font-semibold">rainskiss</span> knows
          how to bring them back.
        </p>
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <a
            href="https://youtube.com/@rainskiss.m"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 text-sm transition"
          >
            ▶ YouTube
          </a>
          <a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black text-sm transition"
          >
            DeviantArt (18+)
          </a>
          <a
            href="https://suno.com/invite/@rainskiss_o"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-yellow-300 text-black hover:bg-yellow-400 text-sm transition"
          >
            ☀️ Suno
          </a>
          <Link
            href="/shop"
            className="px-5 py-2 rounded-full bg-white text-black hover:bg-gray-200 text-sm font-semibold transition"
          >
            🛒 Shop
          </Link>
        </div>
      </main>

      {/* Members 섹션 */}
      <section className="px-6 py-14 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Members Only
          </p>
          <Link
            href="/models"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition"
          >
            <span className="text-white font-semibold text-base">
              AI Models 입장
            </span>
            <span className="text-gray-400 group-hover:text-white transition text-lg">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Patreon 섹션 */}
      <section className="bg-orange-950/40 border-t border-orange-900/30 px-6 py-14">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">
            Support the creator
          </p>
          <h3 className="text-2xl font-bold text-white mb-3">
            Join on Patreon
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Get exclusive music downloads, adult photobooks, behind-the-scenes
            content, and commercial use rights. Every membership goes directly
            to creating more.
          </p>
          <a
            href="https://patreon.com/rainskiss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-400 transition text-base"
          >
            Become a Patron
          </a>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-6 text-xs text-gray-500 text-center border-t border-white/5">
        © 2025 rainskiss · All rights reserved ·{" "}
        <Link href="/letters" className="hover:text-gray-300 transition">
          Send a Letter
        </Link>
      </footer>
    </div>
  )
}
