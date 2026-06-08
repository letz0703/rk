"use client"

import {useRef} from "react"
import Link from "next/link"
import Image from "next/image"
import {motion, useMotionValue, useSpring, useTransform} from "framer-motion"
import {type ShopProduct} from "@/data/shop-products"

const ACCENT = "#c10002"

// 마우스 추적 3D 기울기(magnetic) + #c10002 핀포인트 폴리싱 카드
export default function ProductCard({
  product,
  isAdmin,
  onDelete
}: {
  product: ShopProduct
  isAdmin: boolean
  onDelete: (slug: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  // -0.5 ~ 0.5 정규화 좌표
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const sx = useSpring(px, {stiffness: 220, damping: 18, mass: 0.4})
  const sy = useSpring(py, {stiffness: 220, damping: 18, mass: 0.4})

  // 기울기 각도(절제: 최대 ±6deg)
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])

  // 광원 위치(미세 글레어)
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"])

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  function handleLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <div style={{perspective: 1000}}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{rotateX, rotateY, transformStyle: "preserve-3d"}}
        whileHover={{scale: 1.015}}
        transition={{type: "spring", stiffness: 220, damping: 18}}
        className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#c10002]/50"
      >
        {/* 호버 시 카드 외곽 레드 글로우 */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{boxShadow: `inset 0 0 0 1px ${ACCENT}40, 0 16px 40px -12px ${ACCENT}55`}}
        />

        {/* Admin Delete */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onDelete(product.slug)
            }}
            className="absolute top-2 right-2 z-30 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs transition opacity-0 group-hover:opacity-100"
          >
            ×
          </button>
        )}

        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative w-full aspect-[4/5] bg-white/5">
            <Image
              src={product.previewImage}
              alt={product.title.en}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            />

            {/* 커서 추적 글레어 */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-soft-light"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([x, y]) =>
                    `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 45%)`
                )
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{transform: "translateZ(40px)"}}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/70 backdrop-blur-sm">
                  {product.category}
                </span>
                <span className="text-xs text-white/40 uppercase tracking-wide">
                  Flow Preview
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight mb-1">
                {product.title.en}
              </h2>
              <p className="text-white/60 text-sm line-clamp-2">
                {product.tagline.en}
              </p>
            </div>
          </div>

          <div
            className="relative p-4 flex items-center justify-between"
            style={{transform: "translateZ(20px)"}}
          >
            {/* 호버 시 좌→우로 확장되는 #c10002 라인 */}
            <span
              className="absolute top-0 left-4 right-4 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
              style={{backgroundColor: ACCENT}}
            />
            <span className="text-white/40 text-sm group-hover:text-white/70 transition-colors">
              Get Prompt
            </span>
            <span
              className="text-sm font-bold px-3 py-1 rounded-full text-white"
              style={{backgroundColor: ACCENT}}
            >
              {product.price}
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
