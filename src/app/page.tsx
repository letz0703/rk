import Head from "next/head"
import Image from "next/image"
import Script from "next/script"
import AlertClient from "./components/AlertDynamic"
import LoginButton from "./components/LoginButton"
import User from "./components/User"

export default function Home() {
  let a = "rainskiss.m"
  return (
    <>
      <Head>
        <title>{a}</title>
      </Head>

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <AlertClient />
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <nav className="flex">
            <User />
            <LoginButton />
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
            I Invite You to ...
            <a
              href="https://suno.com/invite/@rainskiss_o"
              className="btn bg-blue-200 p-1 pt-1 text-black"
            >
              RainsKiss @SUNO
            </a>
            <br />
            <code className="mt-2 text-green-200">
              When you sign up and create 10 songs, We both receive 250 free
              credits.
            </code>
          </div>
          <h1 className="text-2xl text-orange-500 text-bold">
            Make Your Own Song <br />
            <span className="text-sm text-white">
              & Let Me Mix or Master Them
            </span>
          </h1>
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2">
              I equalize songs. Buy me a coffee if you like it.
            </li>
            <li className="mb-2">I upscale clips I like.</li>
            <li>
              I create copyright-free music and wallpapers for subscribers (for
              non-commercial use only.)
            </li>
            <li>I will make a 3D doll of you. Email me and let me know.</li>
          </ol>
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
            Just subscribe and email me your favorite link, reference song, and
            lyrics, and let me know.
            <br />
            I'll review your favorite links and create a short video for you in
            my spare time. The short I create will be posted on my YouTube
            channel @rainskiss.m if you don't mind 🦋 Let me know when it's sent
          </code>
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
            coffee 😃
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
