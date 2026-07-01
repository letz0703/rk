"use client"

import React, {useEffect, useState} from "react"
import Link from "next/link"
import {ArrowLeft, Share2, ShieldCheck, Loader2} from "lucide-react"
// 주의: 실제 프로젝트 구조에 맞는 firebase fetch 함수를 임포트해야 합니다.
// 예: import { getProductById } from "@/lib/firebase"

export default function ProductPage({params}: {params: {id: string}}) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 구현 시 Firebase 연동
    // async function loadProduct() {
    //   const data = await getProductById(params.id)
    //   setProduct(data)
    //   setLoading(false)
    // }
    // loadProduct()

    // 임시 시뮬레이션
    setTimeout(() => {
      setProduct({
        id: params.id,
        title: "Y18.1 Soft Gauze",
        price: 26,
        stage: 1,
        mood: "flow",
        category: "Mathematical Fashion",
        prompt:
          "Korean female college student in draping outfit full shot, spring attire, calm and natural expression...",
        collection: "The 1.618 Collection",
        tieredPrompts: {
          level1_clothing: "Soft: Korean female college student in draping outfit...",
          level7_hard_complete: "Hard: Dramatic pose, cinematic lighting, extreme texture..."
        },
        status: "verified"
      })
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading)
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <Loader2 className="text-white animate-spin" size={32} />
      </div>
    )

  if (!product)
    return (
      <div className="text-white text-center py-20">Product not found.</div>
    )

  // Mood-based styling
  const theme = {
    flow: {
      bg: "bg-[#0f0f0f]",
      accent: "text-gray-400",
      border: "border-white/5",
      badge: "bg-white/5 text-gray-300"
    },
    grok: {
      bg: "bg-[#050505]",
      accent: "text-white",
      border: "border-[#c10002]/20",
      badge: "bg-[#c10002]/10 text-[#ff4d4d]"
    },
    balanced: {
      bg: "bg-[#0e0e0e]",
      accent: "text-gray-200",
      border: "border-white/10",
      badge: "bg-white/10 text-white"
    }
  }[product.mood]

  return (
    <div
      className={`min-h-screen ${theme.bg} text-white transition-colors duration-700`}
    >
      {/* Navigation */}
      <nav
        className={`p-6 flex justify-between items-center border-b ${theme.border}`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-xs uppercase tracking-[0.2em]">
            Back to Archive
          </span>
        </Link>
        <div className="text-xl font-black tracking-tighter">RAINSKISS</div>
        <button className="text-gray-400 hover:text-white">
          <Share2 size={18} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Section */}
        <div className="space-y-4">
          <div
            className={`aspect-[3/4] bg-white/5 rounded-2xl border ${theme.border} flex items-center justify-center relative overflow-hidden group`}
          >
            {/* 실제 이미지가 없을 경우를 위한 플레이스홀더 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-gray-600 text-xs uppercase tracking-[0.5em]">
              Sample Visualization
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`aspect-square bg-white/5 rounded-lg border ${theme.border} cursor-pointer hover:border-white/30 transition-all`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="flex flex-col justify-center">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-2 py-0.5 ${theme.badge} text-[10px] font-bold uppercase tracking-wider rounded border ${theme.border}`}
              >
                Stage {product.stage}
              </span>
              <span className="text-gray-500 text-[10px] uppercase tracking-widest">
                {product.collection}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              {product.title}
            </h1>
            <div className={`text-2xl font-mono ${theme.accent}`}>
              ${product.price}
            </div>
          </header>

          <section className="space-y-8">
            {/* Prompt Box */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                  Prompt Iterations
                </h2>
              </div>

              {/* Soft Version ($10) */}
              <div className={`p-6 bg-white/5 rounded-xl border ${theme.border} relative group hover:bg-white/[0.07] transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 bg-white/10 rounded">Soft Version ($10)</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-300 font-extralight italic">
                  "{product.tieredPrompts?.level1_clothing || product.prompt}"
                </p>
              </div>

              {/* Hard Version ($30) */}
              <div className={`p-6 bg-[#c10002]/5 rounded-xl border ${product.mood === 'grok' ? 'border-[#c10002]/40' : theme.border} relative group hover:bg-[#c10002]/10 transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 bg-[#c10002]/20 text-[#ff4d4d] rounded">Hard Version ($30)</span>
                  <div className="absolute top-4 right-6 opacity-40 group-hover:opacity-100 transition-opacity">
                    <ShieldCheck size={20} className="text-[#ff4d4d]" />
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white font-light italic">
                  "{product.tieredPrompts?.level7_hard_complete || "Final check pending for high-intensity prompt."}"
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div
              className={`grid grid-cols-2 gap-8 border-t ${theme.border} pt-8`}
            >
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                  Category
                </h3>
                <p className="text-sm font-light">{product.category}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                  Algorithm
                </h3>
                <p className="text-sm font-light">Phi-1.618 Proportion</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 space-y-4">
              <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-gray-200 transition-all">
                Unlock Prompt Access
              </button>
              <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
                Authorized Access Only · Secure Transaction
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.8em]">
          Mathematical Fashion Design · Ep. 1
        </p>
      </footer>
    </div>
  )
}
