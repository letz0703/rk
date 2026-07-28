"use client"

import {useEffect, useState} from "react"
import {useAuthContext} from "@/components/context/AuthContext"
import {
  createShortlink,
  listShortlinks,
  deleteShortlink,
  type Shortlink
} from "@/api/shortlinkFirebase"

const ACCENT = "#c10002"

export default function ShortlinkAdminPage() {
  const {user, isAdmin, login, logout} = useAuthContext()
  const [links, setLinks] = useState<Shortlink[]>([])
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  // 표시·복사는 항상 공개 도메인 기준 (로컬서 만들어도 rainskiss.com 링크)
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://rainskiss.com"

  const refresh = async () => {
    try {
      setLinks(await listShortlinks())
    } catch {
      setLinks([])
    }
  }

  useEffect(() => {
    if (isAdmin) refresh()
  }, [isAdmin])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setBusy(true)
    try {
      const link = await createShortlink(url.trim(), customSlug.trim() || undefined)
      setMsg(`✅ 생성: ${origin}/s/${link.slug}`)
      setUrl("")
      setCustomSlug("")
      await refresh()
    } catch (err) {
      setMsg("❌ " + (err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm(`/s/${slug} 삭제?`)) return
    await deleteShortlink(slug)
    await refresh()
  }

  const copy = (text: string) => navigator.clipboard.writeText(text)

  // 로그인/권한 게이트
  if (!user) {
    return (
      <Center>
        <button onClick={() => login()} style={btn}>
          사장님 로그인
        </button>
      </Center>
    )
  }
  if (!isAdmin) {
    return (
      <Center>
        <p className="text-white/60">권한 없음</p>
        <button onClick={() => logout()} className="mt-4 text-xs text-white/40 underline">
          로그아웃
        </button>
      </Center>
    )
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black tracking-tight">쇼트링크 관리</h1>
          <button onClick={() => logout()} className="text-xs text-white/40 hover:text-white/70">
            로그아웃
          </button>
        </div>

        {/* 생성 폼 */}
        <form onSubmit={handleCreate} className="space-y-3 mb-6">
          <input
            type="url"
            required
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://긴-원본-URL"
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#c10002]"
          />
          <div className="flex gap-3">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-white/5 border border-white/15 rounded-lg">
              <span className="text-white/40 text-sm shrink-0">{origin}/s/</span>
              <input
                type="text"
                value={customSlug}
                onChange={e => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="커스텀(선택, 비우면 랜덤)"
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-white/30"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="px-6 py-3 rounded-lg text-sm font-black disabled:opacity-50"
              style={{backgroundColor: ACCENT}}
            >
              {busy ? "..." : "단축"}
            </button>
          </div>
        </form>

        {msg && (
          <div className="mb-6 p-3 rounded-lg bg-white/5 border border-white/10 text-sm break-all">
            {msg}
          </div>
        )}

        {/* 목록 */}
        <div className="space-y-2">
          <div className="text-xs text-white/40 mb-2">전체 {links.length}개</div>
          {links.map(l => (
            <div
              key={l.slug}
              className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono text-[#c10002]">/s/{l.slug}</div>
                <div className="text-xs text-white/50 truncate">{l.url}</div>
              </div>
              <div className="text-xs text-white/40 shrink-0">{l.clicks} 클릭</div>
              <button
                onClick={() => copy(`${origin}/s/${l.slug}`)}
                className="text-xs text-white/60 hover:text-white shrink-0"
              >
                복사
              </button>
              <button
                onClick={() => handleDelete(l.slug)}
                className="text-xs text-white/30 hover:text-red-400 shrink-0"
              >
                삭제
              </button>
            </div>
          ))}
          {links.length === 0 && (
            <p className="text-center text-white/30 text-sm py-10">아직 없음</p>
          )}
        </div>
      </div>
    </div>
  )
}

const btn: React.CSSProperties = {
  backgroundColor: ACCENT,
  padding: "12px 24px",
  borderRadius: 8,
  fontWeight: 900,
  fontSize: 13
}

function Center({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center px-6">
      {children}
    </div>
  )
}
