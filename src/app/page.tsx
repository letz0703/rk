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
      <div className="fixed top-0 right-0 z-50 pointer-events-none pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)]">
        <div className="mr-4 mt-4 flex flex-col items-end text-right gap-2 pointer-events-auto select-none">
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
              Aim to 100% volume & loudness zero • 0.0
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
              Perfect Volume for next Generation, 100 Volume - Zero Loudness
            </h1>

            <div className="max-w-4xl mx-auto">
              <ol className="list-inside list-decimal text-sm text-left font-[family-name:var(--font-geist-mono)] space-y-3 leading-relaxed">
                <li>
                  <div>
                    I preserve every track’s true peak, optimizing it to 99–100%
                    without clipping, and normalize loudness to 0.0 — ensuring
                    that great music is passed on to the next generation exactly
                    as it was meant to be heard.
                  </div>
                  <small className="block text-gray-400">
                    Side Effect: Slightly quieter but crystal clear, natural
                    dynamics, and playable louder without ear fatigue.
                  </small>
                </li>
                <li>
                  I colorize clips I like. Colors tuned to my eyes, not presets.
                </li>
                <li>
                  I create copyright-free music and wallpapers for subscribers
                  <small className="text-gray-400">
                    (non-commercial use only)
                  </small>
                  .
                </li>
                <li>I will make a 3D doll (picture) of you.</li>
                <li>One free on subscription</li>
              </ol>
            </div>

            {/* 후원 설명 블록 — 영어만 남김 */}
            <div className="mx-auto max-w-3xl rounded-2xl ring-1 ring-amber-300/50 bg-yellow-50/95 dark:bg-zinc-800/40 p-6 shadow-lg space-y-8">
              <div className="text-neutral-900 dark:text-neutral-100">
                <p className="leading-relaxed text-sm">
                  On YouTube, there are beautiful legendary songs whose volume
                  balance is a little less than ideal. With the latest
                  technology and my own ear (intuition), I restore their
                  loudness and balance to the fullest possible quality—bringing
                  back their original feel and emotion for future generations.
                </p>
                <p className="mt-2 leading-relaxed text-sm">
                  I work using the YouTube “Stats for Nerds” reference, aiming
                  for Volume 100% / Loudness 0.0, so every track plays exactly
                  as intended without the platform’s automatic gain changes.
                </p>

                <h2 className="mt-4 text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-300">
                  <span className="text-orange-700">
                    rainskiss LoFi · classic · Project
                  </span>
                  <br />
                  Your support helps create tomorrow’s classics
                </h2>

                <p className="mt-2 leading-relaxed text-sm">
                  In addition, I create and share free music based on public
                  domain classical works—pieces not bound by the copyright of
                  major labels—allowing everyone to enjoy and use them freely.
                </p>
                <p className="mt-2 leading-relaxed text-sm">
                  This is how “rainskiss LoFi · classic · Projects” are born. 💛
                  Join me on this journey that started in a small studio.
                </p>

                {/* 추가 조건 안내 (영) */}
                <div className="mt-4 rounded-2xl p-4 sm:p-5 ring-1 ring-amber-300/60 bg-amber-50/90 dark:bg-zinc-900/70 text-neutral-900 dark:text-neutral-100">
                  <strong className="block">
                    All songs available for download on our site{" "}
                    <a
                      href="https://rainskiss.com"
                      className="underline text-blue-700 dark:text-blue-300 underline-offset-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      rainskiss.com
                    </a>{" "}
                    can be freely used under the following conditions:
                  </strong>
                  <ul className="mt-2 list-disc list-inside space-y-1 marker:text-amber-700 dark:marker:text-amber-300">
                    <li>🎧 Non-commercial use allowed after subscription</li>
                    <li>
                      🦋{" "}
                      <a
                        href="https://youtube.com/@rainskiss.m"
                        className="underline text-blue-700 dark:text-blue-300 underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        youtube.com/@rainskiss.m
                      </a>
                    </li>
                    <li>
                      © 2025 rainskiss 🌈 All rights reserved by the creator
                    </li>
                    <li>
                      🫧 Commercial use (DSP uploads, monetized content, resale,
                      paid apps) is strictly prohibited without written
                      permission
                    </li>
                  </ul>
                </div>
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
            <div className="text-sm text-white m-2 p-1">
              <a
                href="https://youtube.com/@rainskiss.m"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://youtube.com/@rainskiss.m
              </a>
              <br />
              <a href="https://suno.com/invite/@rainskiss_o">
                https://suno.com/invite/@rainskiss_o
              </a>
              <p className="text-gray-400 text-sm">
                When you sign up and create 10 songs, we both receive 250 free
                credits. Limit of 2500 credits per person.
              </p>
            </div>
            <a
              href="https://www.buymeacoffee.com/rainskiss"
              target="_blank"
              rel="noopener noreferrer"
            >
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
