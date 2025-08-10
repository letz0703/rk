import Head from "next/head"
import Image from "next/image"
import Script from "next/script"
import AlertClient from "./components/AlertDynamic"
import LoginButton from "./components/LoginButton"
import User from "./components/User"
import CheckAdminButton from "./admin/CheckAdmin"
import Banner from "./components/Banner"

export default function Home() {
  let a = "rainskiss.m"
  return (
    <>
      <Head>
        <title>{a}</title>
        <script src="http://localhost:8097"></script>
      </Head>

      {/*<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">*/}
      <div className="grid grid-rows-[auto_1fr_auto] justify-items-center">
        <Banner />
        <AlertClient />
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <nav className="flex">
            <User />
            <LoginButton />
            <CheckAdminButton />
          </nav>
          <Image
            className="dark:invert"
            src="/logo rk.svg"
            alt="rainskiss logo"
            width={180}
            height={38}
            priority
          />
          <div>
            LOUDNESS 0 for BGM
            <br />
            <code className="mt-2 text-green-200">
              Perfect Volume for MOBILE
            </code>
          </div>
          <h1 className="text-2xl text-orange-500 text-bold">
            One Free with Subscription <br />
            <span className="text-sm text-white">
              https://youtubue.com/rasinskiss.m
            </span>
          </h1>
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">I equalize songs.</li>
            <li className="mb-2">I upscale clips I like.</li>
            <li>
              I create copyright-free music and wallpapers for subscribers (for
              non-commercial use only.)
            </li>
            <li>I will make a 3D doll(picture) of you.</li>
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
          <div>
            If you are satisfied with the result or want another, buy me a
            coffee ☕️
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
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
    </>
  )
}
