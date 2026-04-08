import Image from "next/image"
import Link from "next/link"
import HeaderAuth from "./components/HeaderAuth"
import TodaysSong from "./components/TodaysSong"

export default function Page() {
  return (
    <div className="bg-white text-[#1d1d1f]">
      {/* HERO 배너 */}
      <div className="relative w-full h-[70vh]">
        <Image
          src="/hero.jpg"
          alt="hero"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            RAINSKISS
          </h1>
          <p className="mt-3 text-white/80 text-lg font-light">
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
      <main className="flex flex-col items-center text-center px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
          Perfect Volume for next Generation,{" "}
          <span style={{ color: "#c10002" }}>100 Volume – Zero Loudness</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#6e6e73] leading-relaxed max-w-xl">
          Please introduce the timeless songs you&apos;ve lived with all your
          life.
          <br />
          <span style={{ color: "#c10002" }} className="font-semibold">rainskiss</span> knows
          how to bring them back.
        </p>
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          <a
            href="https://youtube.com/@rainskiss.m"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full text-white text-sm font-medium transition hover:opacity-80"
            style={{ backgroundColor: "#c10002" }}
          >
            ▶ YouTube
          </a>
          <a
            href="https://suno.com/invite/@rainskiss_o"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] text-sm font-medium transition"
          >
            ☀️ Suno
          </a>
          <Link
            href="/shop"
            className="px-5 py-2 rounded-full bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] text-sm font-medium transition"
          >
            🛒 Shop
          </Link>
          <a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7] text-sm font-medium transition"
          >
            DeviantArt (18+)
          </a>
        </div>
      </main>

      {/* Today's Life Song */}
      <TodaysSong />

      {/* Members 섹션 */}
      <section className="px-6 py-14 border-t border-[#d2d2d7]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
          <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-widest">
            Members Only
          </p>
          <Link
            href="/models"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#d2d2d7] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition"
          >
            <span className="text-[#1d1d1f] font-semibold text-base">
              AI Models 입장
            </span>
            <span className="text-[#6e6e73] group-hover:text-[#1d1d1f] transition text-lg">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Patreon 섹션 */}
      <section className="bg-[#f5f5f7] border-t border-[#d2d2d7] px-6 py-14">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-widest mb-3">
            Support the creator
          </p>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">
            Join on Patreon
          </h3>
          <p className="text-[#6e6e73] text-sm leading-relaxed mb-8">
            Get exclusive music downloads, adult photobooks, behind-the-scenes
            content, and commercial use rights. Every membership goes directly
            to creating more.
          </p>
          <a
            href="https://patreon.com/rainskiss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 text-white font-semibold rounded-full transition hover:opacity-80 text-base"
            style={{ backgroundColor: "#c10002" }}
          >
            Become a Patron
          </a>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-6 text-xs text-[#6e6e73] text-center border-t border-[#d2d2d7]">
        © 2025 rainskiss · All rights reserved ·{" "}
        <Link href="/letters" className="hover:text-[#1d1d1f] transition">
          Send a Letter
        </Link>{" "}
        ·{" "}
        <Link href="/lifesong" className="hover:text-[#1d1d1f] transition">
          인생곡
        </Link>
      </footer>
    </div>
  )
}
