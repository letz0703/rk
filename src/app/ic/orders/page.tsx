"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import {Phone, Check, Clock, Package, Trash2, RefreshCw} from "lucide-react"
import {useAuthContext} from "@/components/context/AuthContext"
import {
  fbSubscribeOrders,
  fbSetOrderStatus,
  fbDeleteOrder,
  type IcOrder,
  type OrderStatus
} from "@/api/icFirebase"

const STATUS_TABS: {key: OrderStatus | "all"; label: string}[] = [
  {key: "new", label: "신규"},
  {key: "ready", label: "준비완료"},
  {key: "done", label: "픽업완료"},
  {key: "all", label: "전체"}
]

const STATUS_META: Record<
  OrderStatus,
  {label: string; color: string; bg: string}
> = {
  new: {label: "신규", color: "#c10002", bg: "#c1000215"},
  ready: {label: "준비완료", color: "#f59e0b", bg: "#f59e0b15"},
  done: {label: "픽업완료", color: "#6b7280", bg: "#6b728015"}
}

function timeAgo(ts: number): string {
  const min = Math.floor((Date.now() - ts) / 60000)
  if (min < 1) return "방금"
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  return new Date(ts).toLocaleDateString("ko-KR")
}

export default function ICOrdersPage() {
  const {isAdmin, isLoading, login} = useAuthContext()
  const [orders, setOrders] = useState<IcOrder[]>([])
  const [tab, setTab] = useState<OrderStatus | "all">("new")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    const off = fbSubscribeOrders(list => {
      setOrders(list)
      setLoaded(true)
    })
    return () => off()
  }, [isAdmin])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-gray-300" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-500 mb-4">사장님 전용 페이지입니다.</p>
        <button
          onClick={() => login()}
          className="bg-[#c10002] text-white text-sm font-black px-6 py-3 rounded-full"
        >
          사장님 로그인
        </button>
        <Link href="/ic" className="mt-6 text-[11px] text-gray-400 font-black uppercase tracking-widest">
          ← 가격표로
        </Link>
      </div>
    )
  }

  const counts = {
    new: orders.filter(o => o.status === "new").length,
    ready: orders.filter(o => o.status === "ready").length,
    done: orders.filter(o => o.status === "done").length,
    all: orders.length
  }
  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="px-5 pt-12 pb-6 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/ic"
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
          >
            ← 가격표
          </Link>
          <h1 className="text-3xl font-black tracking-tight mt-4">픽업 주문</h1>
          <p className="text-sm text-gray-500 mt-1">
            신규 <span className="text-[#c10002] font-black">{counts.new}</span> · 준비중{" "}
            <span className="font-black text-amber-500">{counts.ready}</span>
          </p>
        </div>
      </div>

      {/* 탭 */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex gap-2">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition ${
                tab === t.key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t.label}
              <span className="ml-1.5 opacity-60">{counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 목록 */}
      <div className="px-5 py-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {!loaded ? (
            <p className="text-center text-sm text-gray-400 py-16">불러오는 중…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-16">
              {tab === "new" ? "새 주문 없음" : "주문 없음"}
            </p>
          ) : (
            filtered.map(o => {
              const meta = STATUS_META[o.status]
              return (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black mb-1.5"
                        style={{color: meta.color, backgroundColor: meta.bg}}
                      >
                        {meta.label}
                      </span>
                      <p className="text-base font-black text-gray-900 leading-tight">
                        {o.productName}
                        <span className="text-[#c10002]"> ×{o.qty}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {o.brandName} · {timeAgo(o.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("이 주문을 삭제할까요?")) fbDeleteOrder(o.id)
                      }}
                      className="text-gray-300 hover:text-red-500 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* 고객 정보 */}
                  <div className="mt-3 pt-3 border-t border-gray-50 space-y-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-black">{o.customerName}</span>
                    </p>
                    <a
                      href={`tel:${o.phone}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[#c10002] font-black"
                    >
                      <Phone size={13} /> {o.phone}
                    </a>
                    {o.pickupDate && (
                      <p className="text-xs text-gray-500">픽업 희망: {o.pickupDate}</p>
                    )}
                    {o.memo && (
                      <p className="text-xs text-gray-500">요청: {o.memo}</p>
                    )}
                  </div>

                  {/* 상태 전환 버튼 */}
                  <div className="mt-3 flex gap-2">
                    {o.status === "new" && (
                      <button
                        onClick={() => fbSetOrderStatus(o.id, "ready")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2.5 rounded-full"
                      >
                        <Package size={13} /> 준비완료 (문자 보내기)
                      </button>
                    )}
                    {o.status === "ready" && (
                      <>
                        <button
                          onClick={() => fbSetOrderStatus(o.id, "done")}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-black py-2.5 rounded-full"
                        >
                          <Check size={13} /> 픽업완료
                        </button>
                        <button
                          onClick={() => fbSetOrderStatus(o.id, "new")}
                          className="px-3 inline-flex items-center justify-center gap-1 bg-gray-100 text-gray-500 text-xs font-black py-2.5 rounded-full"
                        >
                          <Clock size={13} /> 되돌리기
                        </button>
                      </>
                    )}
                    {o.status === "done" && (
                      <button
                        onClick={() => fbSetOrderStatus(o.id, "ready")}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-black py-2.5 rounded-full"
                      >
                        <Clock size={13} /> 준비완료로 되돌리기
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
