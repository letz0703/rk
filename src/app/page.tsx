import Head from "next/head"
import Image from "next/image"
import Script from "next/script"
import AlertClient from "./components/AlertDynamic"
import LoginButton from "./components/LoginButton"
import User from "./components/User"
import CheckAdminButton from "./admin/CheckAdmin"
import Banner from "./components/Banner"

// 1) /public/logo rk.svg  ->  /public/logo-rk.svg 로 파일명 변경
export default function Home() {
  const a = "rainskiss.m"
  return (
    <>
      <Head>
        <title>{a}</title>
        {/* devtools 스크립트 필요 없으면 제거 가능 */}
        <script src="http://localhost:8097"></script>
      </Head>

      {/* 2) 화면 기준으로 고정 + 항상 맨 위 레이어 */}
      <div
        className="fixed top-0 right-0 z-50 pointer-events-none
                pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)]"
      >
        <div
          className="mr-4 mt-4 flex flex-col items-end text-right gap-2
                  pointer-events-auto select-none"
        >
          {/* 로고를 홈으로 링크하고 싶다면 a로 감싸기 */}
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
            <nav className="flex">
              <User />
              <LoginButton />
              <CheckAdminButton />
            </nav>
          </div>

          {/* 읽기 쉽도록 반투명 배경 + 블러 + 그림자 */}
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

      {/* 3) 본문 */}
      <div className="relative min-h-screen">
        <div className="grid grid-rows-[auto_1fr_auto] justify-items-center">
          <Banner />
          <AlertClient />
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-3">
            <h1 className="text-2xl text-orange-500 font-bold">
              Optimize Volume for Youtube{" "}
              {/*<p className="text-sm">
                (Volumn/ Normalize : 100% volume / loudness 0.0 ) <br />
              </p>*/}
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
            {/*<div className="pb-2">coffee ☕️</div>*/}
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
