import Image from "next/image"
import Link from "next/link"
import TodaysSong from "./components/TodaysSong"
import GemsButton from "./components/GemsButton"

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
      </div>

      {/* 본문 */}
      <main className="px-6 py-16 max-w-5xl mx-auto">
        {/* 타이틀 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
            rainskiss — <span style={{color: "#c10002"}}>My Playground</span>
          </h2>
          <p className="mt-3 text-sm text-[#6e6e73]">
            Music · Dance · Beauty · History
          </p>
        </div>

        {/* 3 구역 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Cafe Rainskiss */}
          <a
            href="https://youtube.com/@rainskiss.m"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 p-7 rounded-2xl border border-[#d2d2d7] bg-[#f5f5f7] hover:bg-[#eaeaef] transition"
          >
            <span className="text-2xl">☕</span>
            <h3 className="text-base font-semibold text-[#1d1d1f]">
              Cafe Rainskiss
            </h3>
            <p className="text-sm text-[#6e6e73] leading-relaxed">
              BGM &amp; OST — music for quiet moments, handcrafted at 14 LUFS.
            </p>
            <span className="mt-auto text-xs text-[#6e6e73] group-hover:text-[#1d1d1f] transition">
              YouTube ↗
            </span>
          </a>

          {/* Club Rainskiss */}
          <a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 p-7 rounded-2xl border border-[#d2d2d7] bg-[#f5f5f7] hover:bg-[#eaeaef] transition"
          >
            <span className="text-2xl">🎧</span>
            <h3 className="text-base font-semibold text-[#1d1d1f]">
              Club Rainskiss
            </h3>
            <p className="text-sm text-[#6e6e73] leading-relaxed">
              Dance music with choreography — where the beat never stops.
            </p>
            <span className="mt-auto text-xs text-[#6e6e73] group-hover:text-[#1d1d1f] transition">
              DeviantArt ↗
            </span>
          </a>

          {/* rainskiss-x */}
          {/*<a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 p-7 rounded-2xl border border-[#d2d2d7] bg-[#1d1d1f] hover:bg-[#2d2d2f] transition"
          >*/}
          {/*<span className="text-2xl">✦</span>
            <h3 className="text-base font-semibold text-white">rainskiss-x</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Time-leap through history&apos;s most stunning places, guided by
              the beauties who defined each era.
            </p>
            <span className="mt-auto text-xs text-white/40 group-hover:text-white/80 transition">
              DeviantArt · 18+ ↗
            </span>*/}
          {/*</a>*/}
        </div>

        {/* Featured Product */}
        <div className="mt-16 mb-12 text-center">
          <h2 className="text-xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
            🔥 AI Clothing Prompt Store
          </h2>
          <p className="text-sm text-[#6e6e73] mb-8">
            Professional AI prompts that actually work
          </p>

          <Link
            href="/shop/white-halter-mini"
            className="group inline-block bg-[#1d1d1f] rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 max-w-sm mx-auto"
          >
            <div className="relative w-full h-64 bg-[#f5f5f7]">
              <Image
                src="/shop/white-halter-mini-01.jpg"
                alt="White Halter Dress"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-bold text-white leading-tight">
                  White Halter Dress
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  Flow Preview
                </p>
              </div>
            </div>
            <div className="p-4 text-left">
              <p className="text-sm text-white/70 mb-2">
                Pure yet sophisticated — standing in the light
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">✨ 100% working prompt</span>
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full text-white"
                  style={{backgroundColor: "#c10002"}}
                >
                  $15
                </span>
              </div>
            </div>
          </Link>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#6e6e73] mb-2">
              Free Flow previews available daily on
            </p>
            <a
              href="https://deviantart.com/rainskiss-x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition underline"
            >
              DeviantArt / rainskiss-x ↗
            </a>
          </div>
        </div>

        {/* 보조 링크 */}
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
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
          {/*<Link
            href="/models"
            className="px-5 py-2 rounded-full bg-[#1d1d1f] text-white hover:bg-[#3d3d3f] text-sm font-medium transition"
          >
            ✦ Models
          </Link>*/}
          <GemsButton />
        </div>
      </main>

      {/* Today's Life Song */}
      <TodaysSong />

      {/* 푸터 */}
      <footer className="py-6 text-xs text-[#6e6e73] text-center border-t border-[#d2d2d7]">
        © 2025 rainskiss · All rights reserved ·{" "}
      </footer>
    </div>
  )
}
