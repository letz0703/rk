import type {Metadata} from "next"
import {Geist, Geist_Mono, Inter} from "next/font/google"
import "./globals.css"
import {cn} from "@/lib/utils"

const inter = Inter({subsets: ["latin"], variable: "--font-sans"})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "rainskiss",
  description: "100% Volume for YOUTUBE"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `bg-gray-700 min-h-screen font-sans antialiased ${geistSans.variable} ${geistMono.variable} antialiased`,
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
