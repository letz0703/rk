"use client"

import { useState, useEffect, useTransition, useRef } from "react"
import {
  submitRequest,
  onRequests,
  updateRequestStatus,
  deleteRequest,
  addRequestReply,
  deleteRequestReply,
} from "@/api/firebase"
import { useAuthContext } from "@/components/context/AuthContext"
import { cn } from "@/lib/utils"
import {
  Clock,
  Zap,
  Lock,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Crown,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "@/lib/icons"

// ── Types ──────────────────────────────────────────────────────────────────

type RequestType = "standard" | "tier_priority"
type Visibility = "public" | "private"
type Status = "pending" | "in_progress" | "completed"

interface RequestReply {
  id: string
  content: string
  authorName: string
  createdAt: number
}

interface LookbookRequest {
  id: string
  userId: string | null
  userName: string
  content: string
  type: RequestType
  visibility: Visibility
  status: Status
  createdAt: number
  replies?: Record<string, RequestReply>
}

interface Props {
  modelSlug: string
  modelName: string
  deviantArtUrl: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const DA_BASE = "https://www.deviantart.com/rainskiss-x"
const STATUS_LABEL: Record<Status, string> = {
  pending: "Queued",
  in_progress: "In Progress",
  completed: "Done",
}

// ── Helpers ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { icon: React.ReactNode; cls: string }> = {
    pending: {
      icon: <Clock className="w-3 h-3" />,
      cls: "bg-muted text-muted-foreground",
    },
    in_progress: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      cls: "bg-primary/10 text-primary border border-primary/30",
    },
    completed: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      cls: "bg-green-900/30 text-green-400 border border-green-700/30",
    },
  }
  const { icon, cls } = map[status]
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium", cls)}>
      {icon}
      {STATUS_LABEL[status]}
    </span>
  )
}

function TypeBadge({ type }: { type: RequestType }) {
  return type === "tier_priority" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/15 text-primary border border-primary/25">
      <Crown className="w-3 h-3" />
      Priority
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
      Standard
    </span>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function RequestBoard({ modelSlug, modelName, deviantArtUrl }: Props) {
  const { user, isAdmin, login } = useAuthContext()
  const [requests, setRequests] = useState<LookbookRequest[]>([])
  const [dbError, setDbError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [guestName, setGuestName] = useState("")
  const [content, setContent] = useState("")
  const [reqType, setReqType] = useState<RequestType>("standard")
  const [visibility, setVisibility] = useState<Visibility>("public")
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Standard queue (non-completed public/standard, excluding tier_priority)
  const standardQueue = requests.filter(
    r => r.type === "standard" && r.status !== "completed" && r.visibility !== "private"
  )
  const priorityQueue = requests.filter(
    r => r.type === "tier_priority" && r.status !== "completed"
  )
  const completed = requests.filter(r => r.status === "completed")

  useEffect(() => {
    setDbError(null)
    const unsub = onRequests(
      modelSlug,
      (list: unknown[]) => {
        setDbError(null)
        setRequests(list as LookbookRequest[])
      },
      (err: Error) => {
        if (err?.message?.toLowerCase().includes("permission")) {
          setDbError("permission")
        } else {
          setDbError(err?.message ?? "unknown")
        }
      }
    )
    return unsub
  }, [modelSlug])

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? ""
  const nameToSubmit = user ? displayName : guestName.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    if (!nameToSubmit) { setSubmitError("Please enter your name."); return }
    if (content.trim().length < 10) { setSubmitError("Request must be at least 10 characters."); return }
    setSubmitError("")

    startTransition(async () => {
      await submitRequest(modelSlug, {
        userId: user?.uid ?? null,
        userName: nameToSubmit,
        content: content.trim(),
        type: reqType,
        visibility,
      })
      setContent("")
      setGuestName("")
      setReqType("standard")
      setVisibility("public")
      setSubmitSuccess(true)
      setTimeout(() => { setSubmitSuccess(false); setFormOpen(false) }, 2000)
    })
  }

  async function handleStatusChange(req: LookbookRequest, status: Status) {
    await updateRequestStatus(modelSlug, req.id, status)
  }

  async function handleDelete(req: LookbookRequest) {
    if (confirm("Delete this request?")) await deleteRequest(modelSlug, req.id)
  }

  return (
    <section className="space-y-6">
      {/* ── Firebase Permission Error Banner ──────────────────────────── */}
      {dbError === "permission" && (
        <div className="rounded border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-400 space-y-1">
          <p className="font-medium">Firebase permission denied</p>
          <p className="text-xs text-red-400/70">
            Firebase Realtime Database rules에{" "}
            <code className="bg-red-900/30 px-1 rounded">lookbook_requests</code> 경로가
            허용되어 있지 않습니다.{" "}
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Firebase Console
            </a>{" "}
            → Realtime Database → Rules에 아래 룰을 추가하세요.
          </p>
          <pre className="text-xs bg-black/40 rounded p-2 mt-2 overflow-x-auto text-red-300/80 whitespace-pre-wrap">{`"lookbook_requests": {
  "$modelSlug": {
    ".read": true,
    ".write": true
  }
}`}</pre>
        </div>
      )}

      {/* ── Header + Monetization ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="font-headline text-xl text-foreground">
            Request Board
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Submit a pose, outfit, or scene for {modelName}.
            Standard requests are processed in queue order.
          </p>
        </div>

        {/* External monetization CTAs */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          <a
            href={deviantArtUrl || DA_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 rounded",
              "bg-primary/10 border border-primary/30 text-primary text-xs font-medium",
              "hover:bg-primary/20 transition-colors"
            )}
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Priority Processing
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href={DA_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 rounded",
              "bg-muted border border-border text-muted-foreground text-xs font-medium",
              "hover:border-primary/40 hover:text-foreground transition-colors"
            )}
          >
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Private Request
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href={DA_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 rounded",
              "bg-muted border border-border text-muted-foreground text-xs font-medium",
              "hover:border-primary/40 hover:text-foreground transition-colors"
            )}
          >
            <span className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Become Tier Member
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* ── Tier Info Banner ───────────────────────────────────────────── */}
      <div className="rounded border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground leading-relaxed">
        <span className="text-primary font-medium">Tier Members</span> get automatic priority for up to{" "}
        <span className="text-foreground font-medium">3 requests/month</span>.
        All payments &amp; subscriptions are managed on{" "}
        <a
          href={DA_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:no-underline"
        >
          DeviantArt
        </a>
        .
      </div>

      {/* ── Submit Form Toggle ─────────────────────────────────────────── */}
      <button
        onClick={() => setFormOpen(v => !v)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded",
          "border transition-colors",
          formOpen
            ? "border-primary/50 bg-primary/5 text-primary"
            : "border-border bg-muted text-foreground hover:border-primary/40"
        )}
      >
        <span className="text-sm font-medium">+ Submit a Request</span>
        {formOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* ── Form ──────────────────────────────────────────────────────── */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded border border-border bg-card p-5 space-y-4"
        >
          {/* Guest name (only if not logged in) */}
          {!user && (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Your Name
              </label>
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="e.g. rainskiss_fan"
                maxLength={40}
                className={cn(
                  "w-full px-3 py-2 text-sm rounded border bg-input text-foreground",
                  "border-border focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
                )}
              />
            </div>
          )}

          {user && (
            <p className="text-xs text-muted-foreground">
              Submitting as{" "}
              <span className="text-foreground font-medium">{displayName}</span>
            </p>
          )}

          {/* Request content */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Request Details
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Describe the pose, outfit, setting you want from ${modelName}...`}
              rows={4}
              maxLength={500}
              className={cn(
                "w-full px-3 py-2 text-sm rounded border bg-input text-foreground resize-none",
                "border-border focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
              )}
            />
            <p className="text-right text-xs text-muted-foreground/50">{content.length}/500</p>
          </div>

          {/* Type selector */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Request Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["standard", "tier_priority"] as RequestType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setReqType(t)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded border text-sm transition-colors text-left",
                    reqType === t
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:border-border/80"
                  )}
                >
                  {t === "tier_priority" ? (
                    <Crown className="w-4 h-4 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0" />
                  )}
                  <span>
                    {t === "standard" ? "Standard Queue" : "Tier Priority"}
                  </span>
                </button>
              ))}
            </div>
            {reqType === "tier_priority" && (
              <p className="text-xs text-muted-foreground">
                Select this if you are a tier member on{" "}
                <a href={DA_BASE} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  DeviantArt
                </a>
                .
              </p>
            )}
          </div>

          {/* Visibility (private = link-out) */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded border text-sm transition-colors",
                  visibility === "public"
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground hover:border-border/80"
                )}
              >
                Public
              </button>
              <a
                href={DA_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center gap-1.5 px-3 py-2.5 rounded border text-sm transition-colors",
                  "border-border bg-muted text-muted-foreground hover:border-primary/40",
                  "cursor-pointer"
                )}
              >
                <Lock className="w-3.5 h-3.5" />
                Private (pay) ↗
              </a>
            </div>
          </div>

          {submitError && (
            <p className="text-xs text-red-400">{submitError}</p>
          )}

          {submitSuccess ? (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Submitted! You&apos;re in the queue.
            </div>
          ) : (
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className={cn(
                "w-full py-2.5 rounded text-sm font-medium transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Submitting…" : "Submit Request"}
            </button>
          )}

          {!user && (
            <p className="text-xs text-center text-muted-foreground/60">
              <button
                type="button"
                onClick={login}
                className="text-primary hover:underline"
              >
                Sign in with Google
              </button>{" "}
              to track your requests.
            </p>
          )}
        </form>
      )}

      {/* ── Priority Queue ─────────────────────────────────────────────── */}
      {priorityQueue.length > 0 && (
        <QueueSection
          title="Priority Queue"
          icon={<Crown className="w-4 h-4 text-primary" />}
          items={priorityQueue}
          isAdmin={isAdmin}
          currentUserId={user?.uid ?? null}
          modelSlug={modelSlug}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {/* ── Standard Queue ─────────────────────────────────────────────── */}
      <QueueSection
        title="Standard Queue"
        icon={<Clock className="w-4 h-4 text-muted-foreground" />}
        items={standardQueue}
        isAdmin={isAdmin}
        currentUserId={user?.uid ?? null}
        modelSlug={modelSlug}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        emptyText="No requests yet — be the first!"
      />

      {/* ── Completed ──────────────────────────────────────────────────── */}
      {completed.length > 0 && (
        <QueueSection
          title="Completed"
          icon={<CheckCircle2 className="w-4 h-4 text-green-500" />}
          items={completed}
          isAdmin={isAdmin}
          currentUserId={user?.uid ?? null}
          modelSlug={modelSlug}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          collapsible
        />
      )}
    </section>
  )
}

// ── Queue Section Sub-component ────────────────────────────────────────────

interface QueueSectionProps {
  title: string
  icon: React.ReactNode
  items: LookbookRequest[]
  isAdmin: boolean
  currentUserId: string | null
  modelSlug: string
  onStatusChange: (req: LookbookRequest, status: Status) => void
  onDelete: (req: LookbookRequest) => void
  emptyText?: string
  collapsible?: boolean
}

function QueueSection({
  title,
  icon,
  items,
  isAdmin,
  currentUserId,
  modelSlug,
  onStatusChange,
  onDelete,
  emptyText,
  collapsible = false,
}: QueueSectionProps) {
  const [collapsed, setCollapsed] = useState(collapsible)

  return (
    <div className="space-y-2">
      <button
        onClick={() => collapsible && setCollapsed(v => !v)}
        className={cn(
          "flex items-center gap-2 text-sm font-medium text-foreground w-full",
          collapsible && "hover:text-primary transition-colors"
        )}
      >
        {icon}
        {title}
        <span className="text-muted-foreground font-normal">({items.length})</span>
        {collapsible && (
          <span className="ml-auto">
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </span>
        )}
      </button>

      {!collapsed && (
        <>
          {items.length === 0 && emptyText ? (
            <p className="text-xs text-muted-foreground/60 pl-6">{emptyText}</p>
          ) : (
            <ul className="space-y-2">
              {items.map((req, idx) => {
                const isOwner = currentUserId && req.userId === currentUserId
                return (
                  <li
                    key={req.id}
                    className={cn(
                      "rounded border px-4 py-3 flex flex-col gap-2",
                      req.type === "tier_priority"
                        ? "border-primary/25 bg-primary/5"
                        : "border-border bg-card",
                      isOwner && "border-l-2 border-l-primary"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground font-medium">
                          #{idx + 1}
                        </span>
                        <span className="text-xs text-foreground font-medium">
                          {req.visibility === "private" ? "Anonymous" : req.userName}
                        </span>
                        <TypeBadge type={req.type} />
                        <StatusBadge status={req.status} />
                      </div>

                      {/* Admin controls */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                          <select
                            value={req.status}
                            onChange={e => onStatusChange(req, e.target.value as Status)}
                            className="text-xs bg-input border border-border rounded px-1.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Done</option>
                          </select>
                          <button
                            onClick={() => onDelete(req)}
                            className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {req.visibility === "private" ? (
                      <p className="text-sm text-muted-foreground/60 italic">
                        [Private request]
                      </p>
                    ) : (
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {req.content}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground/50">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {/* Reply thread */}
                    <ReplyThread
                      req={req}
                      modelSlug={modelSlug}
                      isAdmin={isAdmin}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

// ── Reply Thread ───────────────────────────────────────────────────────────

interface ReplyThreadProps {
  req: LookbookRequest
  modelSlug: string
  isAdmin: boolean
}

function ReplyThread({ req, modelSlug, isAdmin }: ReplyThreadProps) {
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const replies = req.replies
    ? Object.values(req.replies).sort((a, b) => a.createdAt - b.createdAt)
    : []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!replyText.trim()) return
    setIsSubmitting(true)
    await addRequestReply(modelSlug, req.id, {
      content: replyText.trim(),
      authorName: "rainskiss",
    })
    setReplyText("")
    setIsSubmitting(false)
    setShowInput(false)
  }

  async function handleDeleteReply(replyId: string) {
    await deleteRequestReply(modelSlug, req.id, replyId)
  }

  if (replies.length === 0 && !isAdmin) return null

  return (
    <div className="mt-1 space-y-2 border-t border-border/40 pt-2">
      {/* Existing replies */}
      {replies.map(reply => (
        <div
          key={reply.id}
          className="flex items-start gap-2 pl-2 border-l-2 border-primary/40"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-semibold text-primary">
                ↳ {reply.authorName}
              </span>
              <span className="text-xs text-muted-foreground/40">
                {new Date(reply.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {reply.content}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => handleDeleteReply(reply.id)}
              className="shrink-0 text-muted-foreground/30 hover:text-red-400 transition-colors mt-0.5"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}

      {/* Admin reply input */}
      {isAdmin && (
        <>
          {!showInput ? (
            <button
              onClick={() => {
                setShowInput(true)
                setTimeout(() => inputRef.current?.focus(), 50)
              }}
              className="text-xs text-primary/60 hover:text-primary transition-colors pl-2"
            >
              + 답변 달기
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 pl-2">
              <textarea
                ref={inputRef}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="답변 내용..."
                rows={2}
                maxLength={300}
                className={cn(
                  "w-full px-2.5 py-1.5 text-xs rounded border bg-input text-foreground resize-none",
                  "border-border focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40"
                )}
              />
              <div className="flex gap-1.5">
                <button
                  type="submit"
                  disabled={isSubmitting || !replyText.trim()}
                  className={cn(
                    "px-3 py-1 text-xs rounded bg-primary text-primary-foreground font-medium",
                    "hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed",
                    "flex items-center gap-1"
                  )}
                >
                  {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  등록
                </button>
                <button
                  type="button"
                  onClick={() => { setShowInput(false); setReplyText("") }}
                  className="px-3 py-1 text-xs rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}
