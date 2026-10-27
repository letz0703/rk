import type {Metadata} from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "STUDIO-X",
  description: "당신의 고민은?",
  robots: {index: false, follow: false}
}

export default function XLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-neutral-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/studiox" className="text-xl font-black tracking-[0.3em]">
            STUDIO<span className="text-rose-500">-X</span>
          </Link>
          <nav className="flex gap-4 text-sm text-neutral-400">
            <Link href="/studiox/stories" className="hover:text-white">이야기</Link>
            <Link href="/studiox/login" className="hover:text-white">입장</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
    </div>
  )
}
