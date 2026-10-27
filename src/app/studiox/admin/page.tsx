"use client"

import {useCallback, useEffect, useState} from "react"

type Submission = {id: string; email: string; text: string; createdAt: number; status: "new" | "accepted" | "rejected"}
type VvipKey = {id: string; maxEpisode: number; createdAt: number; revoked?: boolean}
type Episode = {no: number; title: string; body: string; image?: string; faceImage?: string; published: boolean}

const API = "/api/studiox/admin"
const fmt = (t: number) => new Date(t).toLocaleString("ko-KR")

async function call(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${API}/${path}`, {
    method,
    headers: body ? {"Content-Type": "application/json"} : undefined,
    body: body ? JSON.stringify(body) : undefined
  })
  return {ok: res.ok, status: res.status, data: await res.json().catch(() => ({}))}
}

export default function XAdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [tab, setTab] = useState<"subs" | "vvip" | "eps">("subs")

  useEffect(() => {
    call("submissions").then(r => setAuthed(r.ok))
  }, [])

  if (authed === null) return <p className="text-neutral-500">확인 중…</p>
  if (!authed) return <AdminLogin onDone={() => setAuthed(true)} />

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        {([
          ["subs", "투고"],
          ["vvip", "VVIP 비밀번호"],
          ["eps", "회차"]
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-4 py-2 ${tab === k ? "bg-rose-600 font-bold" : "border border-white/15 text-neutral-400"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "subs" && <Submissions />}
      {tab === "vvip" && <Vvip />}
      {tab === "eps" && <Episodes />}
    </div>
  )
}

function AdminLogin({onDone}: {onDone: () => void}) {
  const [pw, setPw] = useState("")
  const [err, setErr] = useState(false)
  async function login(e: React.FormEvent) {
    e.preventDefault()
    const r = await call("login", "POST", {password: pw})
    if (r.ok) onDone()
    else setErr(true)
  }
  return (
    <form onSubmit={login} className="mx-auto max-w-sm space-y-4 py-10">
      <h1 className="text-xl font-bold">관리자</h1>
      <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="관리자 비밀번호" className={input} />
      {err && <p className="text-sm text-rose-400">비밀번호가 맞지 않습니다.</p>}
      <button className={btn}>들어가기</button>
    </form>
  )
}

// 발급 결과 — 비번은 이 화면에서 한 번만 보인다(DB엔 해시뿐).
function Issued({label, password, onClose}: {label: string; password: string; onClose: () => void}) {
  return (
    <div className="rounded-lg border border-rose-500/60 bg-rose-950/40 p-4 text-sm">
      <p className="text-neutral-300">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <code className="rounded bg-black/50 px-3 py-2 font-mono text-lg">{password}</code>
        <button onClick={() => navigator.clipboard.writeText(password)} className={smallBtn}>복사</button>
        <button onClick={onClose} className="text-neutral-500">닫기</button>
      </div>
      <p className="mt-2 text-xs text-neutral-500">창을 닫으면 다시 볼 수 없습니다. 잃어버리면 재발급하세요.</p>
    </div>
  )
}

function Submissions() {
  const [subs, setSubs] = useState<Submission[]>([])
  const [issued, setIssued] = useState<{email: string; password: string} | null>(null)
  const load = useCallback(() => call("submissions").then(r => setSubs(r.data.submissions ?? [])), [])
  useEffect(() => {
    load()
  }, [load])

  async function act(id: string, action: "accept" | "reject" | "reset") {
    const r = await call("submissions", "POST", {id, action})
    if (r.ok && r.data.password) setIssued({email: r.data.email, password: r.data.password})
    load()
  }

  return (
    <div className="space-y-4">
      {issued && <Issued label={`${issued.email} 에게 보낼 비밀번호`} password={issued.password} onClose={() => setIssued(null)} />}
      {subs.length === 0 && <p className="text-neutral-500">투고가 없습니다.</p>}
      {subs.map(s => (
        <div key={s.id} className="rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>{s.email} · {fmt(s.createdAt)}</span>
            <span className={s.status === "accepted" ? "text-emerald-400" : s.status === "rejected" ? "text-neutral-600" : "text-amber-400"}>
              {s.status === "accepted" ? "채택" : s.status === "rejected" ? "거절" : "새 투고"}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm">{s.text}</p>
          <div className="mt-3 flex gap-2">
            {s.status !== "accepted" && <button onClick={() => act(s.id, "accept")} className={smallBtn}>채택 + 비번 발급</button>}
            {s.status === "accepted" && <button onClick={() => act(s.id, "reset")} className={smallBtn}>비번 재발급</button>}
            {s.status === "new" && <button onClick={() => act(s.id, "reject")} className="text-xs text-neutral-500">거절</button>}
          </div>
        </div>
      ))}
    </div>
  )
}

function Vvip() {
  const [keys, setKeys] = useState<VvipKey[]>([])
  const [latest, setLatest] = useState(0)
  const [custom, setCustom] = useState("")
  const [issued, setIssued] = useState<{password: string; maxEpisode: number} | null>(null)
  const load = useCallback(
    () =>
      call("vvip").then(r => {
        setKeys(r.data.keys ?? [])
        setLatest(r.data.latest ?? 0)
      }),
    []
  )
  useEffect(() => {
    load()
  }, [load])

  async function create() {
    const r = await call("vvip", "POST", custom ? {password: custom} : {})
    if (r.ok) {
      setIssued({password: r.data.password, maxEpisode: r.data.maxEpisode})
      setCustom("")
    }
    load()
  }
  async function revoke(id: string) {
    await call("vvip", "PATCH", {id})
    load()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-400">
        새 비밀번호는 지금 최신 공개 회차(<b className="text-white">{latest}화</b>)까지 얼굴판을 엽니다. 옛 비밀번호는 각자 회차까지 계속 열립니다.
      </p>
      <div className="flex gap-2">
        <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="직접 정하기 (비우면 자동 생성)" className={input} />
        <button onClick={create} className={btn + " w-auto px-6"}>새 VVIP 비밀번호</button>
      </div>
      {issued && (
        <Issued label={`DA 구독자 게시물에 붙여 넣을 비밀번호 · 1~${issued.maxEpisode}화 얼굴판`} password={issued.password} onClose={() => setIssued(null)} />
      )}
      <ul className="divide-y divide-white/10 text-sm">
        {keys.map(k => (
          <li key={k.id} className="flex items-center justify-between py-3">
            <span className={k.revoked ? "text-neutral-600 line-through" : ""}>
              {fmt(k.createdAt)} · 1~{k.maxEpisode}화
            </span>
            {k.revoked ? <span className="text-xs text-neutral-600">폐기됨</span> : <button onClick={() => revoke(k.id)} className="text-xs text-rose-400">폐기</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}

const emptyEp: Episode = {no: 1, title: "", body: "", image: "", faceImage: "", published: false}

function Episodes() {
  const [eps, setEps] = useState<Episode[]>([])
  const [form, setForm] = useState<Episode>(emptyEp)
  const [msg, setMsg] = useState("")
  const load = useCallback(() => call("episodes").then(r => setEps(r.data.episodes ?? [])), [])
  useEffect(() => {
    load()
  }, [load])

  async function save() {
    const r = await call("episodes", "POST", {...form, image: form.image ?? "", faceImage: form.faceImage ?? ""})
    setMsg(r.ok ? `${form.no}화 저장됨` : "저장 실패 — 번호·제목·이미지 주소 확인")
    load()
  }
  async function remove(no: number) {
    await call("episodes", "DELETE", {no})
    load()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border border-white/10 p-4">
        <div className="flex gap-2">
          <input type="number" min={1} value={form.no} onChange={e => setForm({...form, no: Number(e.target.value)})} className={input + " w-24"} />
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="제목" className={input} />
        </div>
        <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} rows={10} placeholder="본문 (마크다운)" className={input} />
        <input value={form.image ?? ""} onChange={e => setForm({...form, image: e.target.value})} placeholder="얼굴 없는 삽화 URL (회원 전원)" className={input} />
        <input value={form.faceImage ?? ""} onChange={e => setForm({...form, faceImage: e.target.value})} placeholder="얼굴판 삽화 URL (VVIP)" className={input} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="accent-rose-600" />
          공개
        </label>
        <div className="flex items-center gap-3">
          <button onClick={save} className={btn + " w-auto px-6"}>저장</button>
          <button onClick={() => setForm({...emptyEp, no: (eps.at(-1)?.no ?? 0) + 1})} className="text-sm text-neutral-500">새 회차</button>
          {msg && <span className="text-sm text-neutral-400">{msg}</span>}
        </div>
      </div>
      <ul className="divide-y divide-white/10 text-sm">
        {eps.map(ep => (
          <li key={ep.no} className="flex items-center justify-between py-3">
            <button onClick={() => setForm({...emptyEp, ...ep})} className="text-left hover:text-rose-400">
              <span className="mr-3 font-mono text-neutral-500">{ep.no}화</span>
              {ep.title}
              {!ep.published && <span className="ml-2 text-xs text-amber-400">비공개</span>}
            </button>
            <button onClick={() => remove(ep.no)} className="text-xs text-neutral-500 hover:text-rose-400">삭제</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const input = "w-full rounded-lg border border-white/15 bg-white/5 p-3 outline-none focus:border-rose-500"
const btn = "w-full rounded-lg bg-rose-600 py-3 font-bold"
const smallBtn = "rounded bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
