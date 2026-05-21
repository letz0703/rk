"use client"

import React, {useState, useEffect} from "react"

interface ActionItem {
  title: string
  description: string
  reason: string
  impact?: string
  benefit?: string
  consequence?: string
  urgency?: string
}

interface OnePunData {
  date: string
  dailyActions: {
    mustDo: ActionItem
    shouldDo: ActionItem
    mustNotSkip: ActionItem
  }
  strategicInsights: string[]
}

export default function OnePunDashboard() {
  const [data, setData] = useState<OnePunData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/onepun")
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("프롬프트가 복사되었습니다, 주군.")
  }

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        전략 엔진 가동 중...
      </div>
    )
  if (!data)
    return <div className="p-8 text-center text-red-500">엔진 가동 실패.</div>

  const {dailyActions, strategicInsights} = data

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-black text-gray-100 min-h-screen font-sans">
      <header className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tighter text-white">
          ONEPUN STRATEGY{" "}
          <span className="text-xs font-normal text-gray-500 ml-2">
            {data.date}
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          주군의 제국 건설을 위한 오늘의 3단계 액션
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Must Do */}
        <div className="border border-white/20 bg-zinc-900 p-6 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 bg-white text-black text-[10px] font-bold">
            MUST
          </div>
          <h2 className="text-xl font-bold mb-3 pr-8">
            {dailyActions.mustDo.title}
          </h2>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {dailyActions.mustDo.description}
          </p>
          <button
            onClick={() => copyToClipboard(dailyActions.mustDo.description)}
            className="w-full py-2 bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors rounded"
          >
            프롬프트 복사
          </button>
        </div>

        {/* Should Do */}
        <div className="border border-gray-800 bg-zinc-900/50 p-6 rounded-lg relative">
          <div className="absolute top-0 right-0 p-2 bg-gray-700 text-white text-[10px] font-bold">
            SHOULD
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-200">
            {dailyActions.shouldDo.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {dailyActions.shouldDo.description}
          </p>
          <button
            onClick={() => copyToClipboard(dailyActions.shouldDo.description)}
            className="w-full py-2 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-white hover:text-black transition-all rounded"
          >
            아이디어 복사
          </button>
        </div>

        {/* Must Not Skip */}
        <div className="border border-red-900/30 bg-zinc-900/30 p-6 rounded-lg relative">
          <div className="absolute top-0 right-0 p-2 bg-red-900 text-white text-[10px] font-bold">
            SKIP PROHIBITED
          </div>
          <h3 className="text-xl font-bold mb-3 text-red-100">
            {dailyActions.mustNotSkip.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed italic">
            "{dailyActions.mustNotSkip.description}"
          </p>
          <div className="text-[10px] text-red-500 font-mono uppercase tracking-widest">
            Consequence: {dailyActions.mustNotSkip.consequence}
          </div>
        </div>
      </div>

      <section className="bg-zinc-900 p-6 border-l-4 border-white rounded-r-lg">
        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
          Strategic Insights
        </h4>
        <ul className="space-y-3">
          {strategicInsights.map((insight, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-start">
              <span className="text-white mr-2">/</span>
              <span>{insight.replace(/\*\*/g, "")}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="text-[10px] text-gray-600 text-center uppercase tracking-widest pt-8">
        RainsKiss Empire Strategy Engine v.M10-Enhanced
      </footer>
    </div>
  )
}
