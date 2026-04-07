"use client"

import { useState, useEffect } from "react"
import { submitInquiry, onInquiries, addInquiryReply, toggleInquiryResolved, deleteInquiry } from "@/api/firebase"
import { useAuthContext } from "@/components/context/AuthContext"

type Reply = {
  id: string
  content: string
  createdAt: number
}

type Inquiry = {
  id: string
  name: string
  title: string
  content: string
  createdAt: number
  resolved?: boolean
  replies?: Record<string, Reply>
}

export default function InquiryPage() {
  const { isAdmin } = useAuthContext()

  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [replying, setReplying] = useState(false)

  useEffect(() => {
    const unsub = onInquiries(setInquiries)
    return unsub
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    await submitInquiry({ name, title, content })
    setName("")
    setTitle("")
    setContent("")
    setSubmitting(false)
  }

  const handleReply = async (inquiryId: string) => {
    if (!replyContent.trim()) return
    setReplying(true)
    await addInquiryReply(inquiryId, replyContent)
    setReplyContent("")
    setReplyTarget(null)
    setReplying(false)
  }

  const handleDelete = async (inquiryId: string) => {
    if (!confirm("이 문의를 삭제할까요?")) return
    await deleteInquiry(inquiryId)
    if (openId === inquiryId) setOpenId(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">

      <h1 className="text-3xl font-bold mb-2">1:1 문의</h1>
      <p className="text-sm opacity-60 mb-8">궁금한 점이나 요청 사항을 남겨주세요.</p>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-12">
        <div>
          <label className="block text-sm opacity-70 mb-1">이름 (선택)</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름 또는 닉네임"
            className="w-full px-4 py-3 border border-current/20 bg-transparent focus:outline-none focus:border-current text-foreground placeholder:text-foreground/30"
          />
        </div>
        <div>
          <label className="block text-sm opacity-70 mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="문의 제목"
            required
            className="w-full px-4 py-3 border border-current/20 bg-transparent focus:outline-none focus:border-current text-foreground placeholder:text-foreground/30"
          />
        </div>
        <div>
          <label className="block text-sm opacity-70 mb-1">내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="문의 내용을 입력해주세요."
            rows={5}
            required
            className="w-full px-4 py-3 border border-current/20 bg-transparent focus:outline-none focus:border-current resize-none text-foreground placeholder:text-foreground/30"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
          className="w-full py-3 font-bold disabled:opacity-40"
          style={{ background: "#c10002", color: "#fff" }}
        >
          {submitting ? "제출 중..." : "문의 제출"}
        </button>
      </form>

      <hr className="opacity-20 mb-8" />

      {/* 문의 목록 */}
      <h2 className="text-base font-semibold opacity-70 mb-4">
        문의 목록{inquiries.length > 0 && <span style={{ color: "#c10002" }}> ({inquiries.length})</span>}
      </h2>

      {inquiries.length === 0 ? (
        <p className="text-sm opacity-40">아직 문의가 없습니다.</p>
      ) : (
        <ul className="border-t border-current/10">
          {inquiries.map(inq => {
            const isOpen = openId === inq.id
            const replies = inq.replies
              ? Object.values(inq.replies).sort((a, b) => a.createdAt - b.createdAt)
              : []
            return (
              <li key={inq.id} className="border-b border-current/10">
                {/* 제목 행 — 클릭으로 토글 */}
                <button
                  onClick={() => setOpenId(isOpen ? null : inq.id)}
                  className="w-full text-left py-4 flex justify-between items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {inq.resolved && <span style={{ color: "#c10002" }}>✓</span>}
                    <span className={`font-semibold truncate ${inq.resolved ? "line-through opacity-40" : ""}`}>
                      {inq.title}
                    </span>
                    {replies.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 shrink-0" style={{ background: "#c10002", color: "#fff" }}>
                        답변
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="text-xs opacity-40">{inq.name} · {new Date(inq.createdAt).toLocaleDateString("ko-KR")}</span>
                    <span className="text-xs opacity-40">{isOpen ? "▲" : "▼"}</span>
                  </span>
                </button>

                {/* 펼쳐진 내용 */}
                {isOpen && (
                  <div className="pb-5 pl-2">
                    <p className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed mb-4">{inq.content}</p>

                    {/* 답글 목록 */}
                    {replies.length > 0 && (
                      <ul className="mb-4 space-y-2 ml-4" style={{ borderLeft: "2px solid #c10002" }}>
                        {replies.map(r => (
                          <li key={r.id} className="pl-4 py-3">
                            <p className="text-xs font-semibold mb-1" style={{ color: "#c10002" }}>관리자 답변</p>
                            <p className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed">{r.content}</p>
                            <p className="text-xs opacity-30 mt-1">{new Date(r.createdAt).toLocaleDateString("ko-KR")}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* 관리자 전용 액션 */}
                    {isAdmin && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleInquiryResolved(inq.id, !inq.resolved)}
                            className="text-xs border border-current/20 px-3 py-1 hover:opacity-80 transition-opacity"
                          >
                            {inq.resolved ? "해결 취소" : "해결 완료"}
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="text-xs border px-3 py-1 hover:opacity-80 transition-opacity"
                            style={{ borderColor: "#c10002", color: "#c10002" }}
                          >
                            삭제
                          </button>
                        </div>

                        {replyTarget === inq.id ? (
                          <div className="ml-4 pl-4 space-y-2" style={{ borderLeft: "2px solid #c10002" }}>
                            <textarea
                              value={replyContent}
                              onChange={e => setReplyContent(e.target.value)}
                              placeholder="답글을 입력하세요..."
                              rows={3}
                              className="w-full px-3 py-2 border border-current/20 bg-transparent text-sm focus:outline-none resize-none text-foreground placeholder:text-foreground/30"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReply(inq.id)}
                                disabled={replying || !replyContent.trim()}
                                className="px-4 py-1.5 text-sm font-semibold disabled:opacity-40"
                                style={{ background: "#c10002", color: "#fff" }}
                              >
                                {replying ? "저장 중..." : "저장"}
                              </button>
                              <button
                                onClick={() => { setReplyTarget(null); setReplyContent("") }}
                                className="px-4 py-1.5 text-sm opacity-50 hover:opacity-100 border border-current/20"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setReplyTarget(inq.id); setReplyContent("") }}
                            className="text-xs font-semibold"
                            style={{ color: "#c10002" }}
                          >
                            + 답글 달기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
