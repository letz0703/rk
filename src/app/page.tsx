//"use client"
import Image from "next/image"
import Script from "next/script"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo rk.svg"
          alt="rainskiss logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Perfect VOLUME for YOUTUBE : the volume will be →
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              Normalized : 100% /100% (content loudness -0.0db)
            </code>
            .
          </li>
          <li> I equalize the volume of a song every day :
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              youtube.com/@rainskiss.m
            </code>
          </li>
          <li>rainskiss@gmail.com
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              : It is free for now. Subscribe and buy me a coffee if you like my work.
            </code>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://www.youtube.com/@rainskiss.m"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/*<Image
              className="dark:invert"
              src="/logo rk.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />*/}
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
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/*<a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://buymeacoffee.com/rainskiss"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/coffee.jpg"
            alt="buy me a coffee"
            width={50}
            height={50}
          />buy me a coffee ~
        </a>*/}
        <a href="https://www.buymeacoffee.com/rainskiss" target="_blank">
          <Image src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"
            height={40} width={130}
          /></a>
        <Script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="rainskiss" data-color="#FFDD00" data-emoji="☕" data-font="Comic" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" />
      </footer>
    </div>
  )
}
