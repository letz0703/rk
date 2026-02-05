import Image from "next/image"

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
      </div>

      {/* 본문 */}
      <main className="flex flex-col items-center text-center px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 drop-shadow-sm">
          Perfect Volume for next Generation, 100 Volume – Zero Loudness
        </h2>

        <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
          Please introduce the timeless songs you’ve lived with all your life.
          <br />
          <span className="text-orange-400 font-semibold">rainskiss</span> knows
          how to bring them back.
        </p>

        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <a
            href="https://youtube.com/@rainskiss.m"
            target="_blank"
            className="px-5 py-2 rounded-full bg-black text-white hover:bg-zinc-700 text-sm"
          >
            .m: YouTube
          </a>
          <a
            href="https://deviantart.com/rainskiss"
            target="_blank"
            className="px-5 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black text-sm"
          >
            .x: DeviantArt(18+)
          </a>
          <a
            href="https://suno.com/invite/@rainskiss_o"
            target="_blank"
            className="px-5 py-2 rounded-full bg-yellow-300 text-black hover:bg-yellow-400 text-sm"
          >
            ☀️ suno invite
          </a>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="py-6 text-xs text-gray-500 text-center">
        © 2025 rainskiss · All rights reserved
      </footer>
    </div>
  )
}
