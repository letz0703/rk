import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import "./globals.css"
import {cn} from "@/lib/utils"

// Inter 제거 — Geist가 --font-sans 역할 통합 (폰트 요청 3→2)
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "rainskiss",
  description: "100% Volume for YOUTUBE"
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-gray-700 font-sans antialiased overflow-x-hidden",
          geistSans.variable,
          geistMono.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
