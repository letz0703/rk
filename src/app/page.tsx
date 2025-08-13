import Head from "next/head"
import Image from "next/image"
import Script from "next/script"
import AlertClient from "./components/AlertDynamic"
import LoginButton from "./components/LoginButton"
import User from "./components/User"
import CheckAdminButton from "./admin/CheckAdmin"
import Banner from "./components/Banner"
import BGMPage from "./components/BGMPage"
import ListBgm from "./components/ListBgm"
import Nav from "./components/Nav"

export default function Home() {
  const a = "rainskiss.m"
  return (
    <>
      <Head>
        <title>{a}</title>
        <script src="http://localhost:8097"></script>
      </Head>

      {/* 오른쪽 상단 고정 영역 */}
      <div
        className="fixed top-0 right-0 z-50 pointer-events-none
                pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)]"
      >
        <div
          className="mr-4 mt-4 flex flex-col items-end text-right gap-2
                  pointer-events-auto select-none"
        >
          <a href="/" aria-label="rainskiss home" className="inline-block">
            <img
              src="/logo-rk.svg"
              alt="rainskiss logo"
              width={96}
              height={44}
              loading="eager"
              className="block"
            />
          </a>
          <div>
            <Nav />
          </div>
          <div className="rounded-xl bg-black/30 backdrop-blur-sm px-3 py-2">
            <div className="text-white drop-shadow-lg text-sm sm:text-base leading-snug">
              Aim to loudness zero • 0.0
            </div>
            <code className="block text-blue-200 drop-shadow-lg text-xs sm:text-sm mt-0.5 tracking-wide">
              100% Volume • Beyond Generations
            </code>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="relative min-h-screen">
        <div className="grid grid-rows-[auto_1fr_auto] justify-items-center">
          <Banner />
          <AlertClient />
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-3">
            <h1 className="text-2xl text-orange-500 font-bold">
              Optimize Volume for Youtube
              <div className="text-sm text-white m-2 p-1">
                https://youtubue.com/@rasinskiss.m <br />
                <a href="https://suno.com/invite/@rainskiss_o">
                  https://suno.com/invite/@rainskiss_o
                </a>
                <p className="text-gray-400 text-sm">
                  When you signs up and creates 10 songs, we both receive 250
                  free credits. Limit of 2500 credits per person.
                </p>
              </div>
            </h1>

            <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              <li className="mb-2">
                I normalize songs for best volume on youtube.
              </li>
              <li className="mb-2">I colorize clips I like.</li>
              <li>
                I create copyright-free music and wallpapers for subscribers
                (for non-commercial use only.)
              </li>
              <li>I will make a 3D doll(picture) of you.</li>
              <li>One free on subscription</li>
            </ol>

            {/* 후원 설명 블록 */}
            <div className="mx-auto max-w-3xl rounded-2xl border border-yellow-400/40 bg-yellow-50/90 dark:bg-yellow-100/10 p-6 shadow-lg space-y-6">
              {/* 영어 */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  <span className="text-orange-700"> New Classic Project</span>{" "}
                  <br />
                  Your support helps create tomorrow’s classics
                </h2>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  On YouTube, there are beautiful legendary songs whose volume
                  balance is a little less than ideal. <br />
                  With the latest technology and my own ear (intuition), I
                  restore their loudness and balance to the fullest possible
                  quality—bringing back their original feel and emotion for
                  future generations.
                </p>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  I work using the YouTube “Stats for Nerds” reference, aiming
                  for Volume 100% / Loudness 0.0, so every track plays exactly
                  as intended without the platform’s automatic gain changes.{" "}
                  <br />
                  <br />
                  In addition, I create and share free music based on public
                  domain classical works—pieces not bound by the copyright of
                  major labels—allowing everyone to enjoy and use them freely.
                </p>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  This is how “New Classics” are born. 💛 Join me on this
                  journey that started in a small studio.
                </p>
                <a
                  href="https://www.buymeacoffee.com/rainskiss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 mt-2 text-sm font-semibold bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black shadow-md transition"
                >
                  ☕ Support via Buy Me A Coffee
                </a>
              </div>

              {/* 일본어 */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  🎧 New Classic Project —
                  あなたの支援が未来のクラシックを生み出します。
                </h2>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  YouTubeには、美しいのに音量バランスがやや物足りない名曲が多くあります。
                  私は最新の技術と自分の耳（感覚）を用いて、ラウドネスとバランスを可能な限り高品質に整え、曲本来の感情と質感を未来へ残す復元を行います。
                </p>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  作業は YouTube「Stats for Nerds」の基準を使用し、Volume 100% /
                  Loudness 0.0 を目標にしています。
                  さらに、大手レーベルの著作権に縛られないクラシックの名曲を基に、無料で使える音楽を制作・配布しています。
                </p>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  こうして「New Classics」が誕生します。 💛
                  小さなスタジオから始まったこの旅に、ぜひご参加ください。
                </p>
              </div>

              {/* 한국어 */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  🎧 New Classic Project — 당신의 후원이 미래의 클래식을
                  만듭니다.
                </h2>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  유튜브에는 아름답지만 볼륨 밸런스가 조금 아쉬운 명곡들이
                  있습니다. 저는 최신 기술과 제 귀(느낌)으로 라우드니스와
                  밸런스를 가능한 최고 품질로 복원해, 곡이 지닌 원래의 감정과
                  질감을 후세에 남깁니다.
                </p>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  작업은 유튜브 ‘stats for nerds’ 기준으로, Volume 100% /
                  Loudness 0.0을 목표로 합니다. 또한, 거대 레이블의 저작권이
                  없는 클래식 명곡을 기반으로 무료 음악을 제작·배포합니다.
                </p>
                <p className="mt-2 text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                  이렇게 해서 “New Classic”이 탄생합니다. 💛 작은 스튜디오에서
                  시작된 이 여정에 함께해주세요.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                href="https://www.youtube.com/@rainskiss.m"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b>youtube</b>
              </a>
              <a
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                href="mailto:rainskiss@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                ✉️ request by email
              </a>
            </div>
          </main>

          <footer className="pt-6 row-start-3 flex gap-6 flex-wrap items-center justify-center">
            <a href="https://www.buymeacoffee.com/rainskiss" target="_blank">
              <Image
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                height={40}
                width={130}
              />
            </a>
            <Script
              type="text/javascript"
              src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
              data-name="bmc-button"
              data-slug="rainskiss"
              data-color="#FFDD00"
              data-emoji="☕"
              data-font="Comic"
              data-text="Buy me a coffee"
              data-outline-color="#000000"
              data-font-color="#000000"
              data-coffee-color="#ffffff"
            />
          </footer>
        </div>
      </div>
    </>
  )
}
