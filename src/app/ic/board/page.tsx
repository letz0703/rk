"use client"

import {Suspense, useEffect, useState} from "react"
import Link from "next/link"
import {useSearchParams} from "next/navigation"
import {Lock, Loader2, Check, Trash2, Send, MessageCircle, Phone} from "lucide-react"
import {useAuthContext} from "@/components/context/AuthContext"
import {
  fbCreatePost,
  fbSubscribePosts,
  fbSubscribePostsPrivate,
  fbSetPostReply,
  fbDeletePost,
  type IcPost,
  type IcPostPrivate
} from "@/api/icFirebase"

// 작성자 이름 마스킹: 홍길동 → 홍**, 김 → 김, 빈값 → 익명
function maskName(name: string): string {
  const n = (name || "").trim()
  if (!n) return "익명"
  if (n.length === 1) return n
  return n[0] + "*".repeat(Math.min(n.length - 1, 3))
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit"
  })
}

// admin일 때 public 글에 private(전화·원문·비공개답변) 병합한 형태
type MergedPost = IcPost & {priv?: IcPostPrivate}

// 문의 작성 폼
function WriteForm({prefillProduct}: {prefillProduct: string}) {
  const [author, setAuthor] = useState("")
  const [product, setProduct] = useState(prefillProduct)
  const [phone, setPhone] = useState("")
  const [question, setQuestion] = useState("")
  const [secret, setSecret] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => setProduct(prefillProduct), [prefillProduct])

  const canSubmit = author.trim() && question.trim() && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await fbCreatePost({
        author: author.trim(),
        product: product.trim() || undefined,
        phone: phone.trim() || undefined,
        question: question.trim(),
        secret
      })
      setQuestion("")
      setSecret(false)
      setPhone("")
      setDone(true)
      setTimeout(() => setDone(false), 2500)
    } catch (e) {
      alert("문의 등록 실패: " + (e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#c10002] mb-4">
        문의 작성
      </p>
      <div className="space-y-3">
        <div className="flex gap-3">
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="이름 (닉네임 가능)"
            className="w-1/2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c10002]"
          />
          <input
            value={product}
            onChange={e => setProduct(e.target.value)}
            placeholder="상품명 (선택)"
            className="w-1/2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c10002]"
          />
        </div>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          inputMode="tel"
          placeholder="연락처 (예: 010-1234-5678) · 담당자만 봄"
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c10002]"
        />
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="문의 내용 (가격·재고·방문 예약 등)"
          rows={3}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c10002] resize-none"
        />
        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={secret}
              onChange={e => setSecret(e.target.checked)}
              className="w-4 h-4 accent-[#c10002]"
            />
            <Lock size={13} className={secret ? "text-[#c10002]" : "text-gray-400"} />
            비밀글 (내용을 담당자만 봄)
          </label>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-1.5 bg-[#c10002] disabled:opacity-40 text-white text-sm font-black px-5 py-2.5 rounded-full transition hover:bg-[#a00001]"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : done ? (
              <Check size={14} />
            ) : (
              <Send size={14} />
            )}
            {done ? "등록됨" : "문의 등록"}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 leading-5">
          연락처·비밀글 내용은 담당자만 볼 수 있어요. 비공개 답변은 게시판에
          안 뜨고 담당자가 연락처로 개별 안내합니다.
        </p>
      </div>
    </div>
  )
}

// 답변 블록 (admin 편집 / 고객 열람)
function ReplyBlock({post}: {post: MergedPost}) {
  const {isAdmin} = useAuthContext()
  const [editing, setEditing] = useState(false)
  // 공개답변은 post.reply, 비공개답변은 priv.reply
  const existingReply = post.reply || post.priv?.reply || ""
  const hasReply = !!existingReply || post.repliedAt !== undefined
  const [draft, setDraft] = useState(existingReply)
  // 기본 공개여부: 질문이 비밀글이면 비공개 기본, 아니면 공개 기본
  const [isPublic, setIsPublic] = useState(
    post.replyPublic ?? !post.secret
  )
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      await fbSetPostReply(post.id, draft.trim(), isPublic)
      setEditing(false)
    } catch (e) {
      alert("답변 저장 실패: " + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="mt-3 pl-4 border-l-2 border-[#c10002]">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="답변 입력…"
          rows={2}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c10002] resize-none"
        />
        {/* 답변 공개/비공개 토글 */}
        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            className={`text-xs font-black px-3 py-1.5 rounded-full border ${
              isPublic
                ? "bg-[#c10002] text-white border-[#c10002]"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            공개 답변
          </button>
          <button
            type="button"
            onClick={() => setIsPublic(false)}
            className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full border ${
              !isPublic
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            <Lock size={11} /> 비공개(전화 안내)
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1 bg-[#c10002] disabled:opacity-40 text-white text-xs font-black px-3 py-1.5 rounded-full"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            저장
          </button>
          <button
            onClick={() => {
              setDraft(existingReply)
              setEditing(false)
            }}
            className="text-xs font-black text-gray-400 px-3 py-1.5"
          >
            취소
          </button>
        </div>
      </div>
    )
  }

  // 공개 답변 있음
  if (post.reply && post.replyPublic) {
    return (
      <div className="mt-3 pl-4 border-l-2 border-[#c10002] bg-[#c10002]/5 rounded-r-xl py-2 pr-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#c10002] mb-1">
          담당자 답변{" "}
          {post.repliedAt && (
            <span className="text-gray-400 normal-case tracking-normal ml-1">
              {fmtDate(post.repliedAt)}
            </span>
          )}
        </p>
        <p className="text-sm text-gray-700 leading-6 whitespace-pre-wrap">
          {post.reply}
        </p>
        {isAdmin && (
          <button
            onClick={() => setEditing(true)}
            className="text-[11px] font-black text-gray-400 hover:text-[#c10002] mt-1"
          >
            답변 수정
          </button>
        )}
      </div>
    )
  }

  // 비공개 답변 완료 (repliedAt 있고 공개아님)
  if (hasReply && post.replyPublic === false) {
    return (
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[11px] font-black text-gray-500">
          <Lock size={11} /> 답변 완료 · 담당자가 연락처로 개별 안내
        </span>
        {isAdmin && post.priv?.reply && (
          <span className="text-[11px] text-gray-400 italic">
            (비공개: {post.priv.reply})
          </span>
        )}
        {isAdmin && (
          <button
            onClick={() => setEditing(true)}
            className="text-[11px] font-black text-gray-400 hover:text-[#c10002]"
          >
            답변 수정
          </button>
        )}
      </div>
    )
  }

  // 답변 없음
  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">
        답변 대기 중
      </span>
      {isAdmin && (
        <button
          onClick={() => setEditing(true)}
          className="text-[11px] font-black text-[#c10002] hover:opacity-70"
        >
          답변 달기
        </button>
      )}
    </div>
  )
}

function PostRow({post, isAdmin}: {post: MergedPost; isAdmin: boolean}) {
  // 비밀글은 공개 목록에서 question=""로 옴. admin은 priv.question으로 원문 봄.
  const fullQuestion = post.secret
    ? isAdmin
      ? post.priv?.question || ""
      : ""
    : post.question
  const locked = post.secret && !isAdmin
  const phone = isAdmin ? post.priv?.phone : undefined

  return (
    <div className="border-b border-gray-100 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {post.secret && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-[#c10002]">
                <Lock size={11} /> 비밀글
              </span>
            )}
            {post.product && (
              <span className="text-[11px] font-black text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                {post.product}
              </span>
            )}
            <span className="text-[11px] text-gray-400">
              {maskName(post.author)} · {fmtDate(post.createdAt)}
            </span>
            {/* admin 전용: 연락처 */}
            {phone && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-gray-600 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5">
                <Phone size={10} /> {phone}
              </span>
            )}
          </div>
          {locked ? (
            <p className="text-sm text-gray-400 italic">
              🔒 비밀글입니다. 담당자만 볼 수 있어요.
            </p>
          ) : (
            <p className="text-sm text-gray-800 leading-6 whitespace-pre-wrap">
              {fullQuestion}
            </p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (confirm("이 문의를 삭제할까요?")) fbDeletePost(post.id)
            }}
            className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
            title="문의 삭제"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {/* 답변: admin은 항상, 고객은 잠금 아닐 때만 */}
      {(isAdmin || !locked) && <ReplyBlock post={post} />}
    </div>
  )
}

function BoardContent() {
  const {isAdmin} = useAuthContext()
  const searchParams = useSearchParams()
  const prefillProduct = searchParams.get("product") || ""
  const [posts, setPosts] = useState<IcPost[]>([])
  const [priv, setPriv] = useState<Record<string, IcPostPrivate>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const off = fbSubscribePosts(list => {
      setPosts(list)
      setLoading(false)
    })
    return () => off()
  }, [])

  // admin만 private(전화·원문·비공개답변) 구독
  useEffect(() => {
    if (!isAdmin) {
      setPriv({})
      return
    }
    const off = fbSubscribePostsPrivate(setPriv)
    return () => off()
  }, [isAdmin])

  const merged: MergedPost[] = posts.map(p => ({...p, priv: priv[p.id]}))

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 헤더 */}
      <div className="px-6 pt-14 pb-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/ic"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition mb-8"
          >
            ← 깡통시장 가격표
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c10002] mb-3">
            Q &amp; A Board
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-black flex items-center gap-3">
            <MessageCircle size={36} className="text-[#c10002]" strokeWidth={2.5} />
            문의 게시판
          </h1>
          <p className="text-gray-500 text-sm mt-4 leading-6">
            상품 가격·재고·방문 예약을 여기에 남겨주세요. 담당자가 깡통시장 현재
            시세 확인 후 <span className="font-black text-gray-900">게시판 답변</span>
            으로 안내드립니다. 연락처 등 노출이 걱정되면{" "}
            <span className="font-black text-[#c10002]">비밀글</span>로 남겨주세요.
          </p>
        </div>
      </div>

      {/* 작성 폼 */}
      <div className="px-6 pt-8">
        <div className="max-w-3xl mx-auto">
          <WriteForm prefillProduct={prefillProduct} />
        </div>
      </div>

      {/* 목록 */}
      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            문의 {posts.length}건
          </p>
          {loading ? (
            <p className="text-sm text-gray-400 py-10 text-center">불러오는 중…</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              아직 문의가 없어요. 첫 문의를 남겨보세요.
            </p>
          ) : (
            <div>
              {merged.map(post => (
                <PostRow key={post.id} post={post} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ICBoardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-300" />
        </div>
      }
    >
      <BoardContent />
    </Suspense>
  )
}
