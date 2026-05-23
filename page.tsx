"use client"

import React, {useState} from "react"

interface QCProduct {
  id: string
  title: string
  status: "draft" | "testing" | "verified" | "live"
  price: number
  stage: number
  locked: boolean
  currentPromptVersion: number
}

export default function QCDashboard() {
  const [products, setProducts] = useState<QCProduct[]>([
    {
      id: "1",
      title: "Y18.1 Soft Gauze",
      status: "draft",
      price: 26,
      stage: 1,
      locked: false,
      currentPromptVersion: 1
    },
    {
      id: "2",
      title: "Y18.2 Mesh Texture",
      status: "testing",
      price: 42,
      stage: 2,
      locked: false,
      currentPromptVersion: 1
    }
  ])

  const getStatusCount = (status: QCProduct["status"]) =>
    products.filter(p => p.status === status).length

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tighter mb-2">
          QC COMMAND CENTER
        </h1>
        <p className="text-gray-500 text-sm tracking-[0.3em] uppercase">
          Quality Control Workflow
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusColumn
          status="draft"
          title="초안 (Draft)"
          products={products.filter(p => p.status === "draft")}
        />
        <StatusColumn
          status="testing"
          title="테스트 (Testing)"
          products={products.filter(p => p.status === "testing")}
        />
        <StatusColumn
          status="verified"
          title="검증완료 (Verified)"
          products={products.filter(p => p.status === "verified")}
        />
        <StatusColumn
          status="live"
          title="판매중 (Live)"
          products={products.filter(p => p.status === "live")}
        />
      </div>
    </div>
  )
}

function StatusColumn({
  status,
  title,
  products
}: {
  status: QCProduct["status"]
  title: string
  products: QCProduct[]
}) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case "draft":
        return "border-gray-700 bg-gray-900/30"
      case "testing":
        return "border-blue-900/50 bg-blue-900/10"
      case "verified":
        return "border-green-900/50 bg-green-900/10"
      case "live":
        return "border-[#c10002]/50 bg-[#c10002]/5"
      default:
        return "border-gray-800"
    }
  }

  return (
    <div
      className={`flex flex-col rounded-xl border p-4 ${getStatusColor(status)}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">
          {title}
        </h2>
        <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono">
          {products.length}
        </span>
      </div>

      <div className="space-y-3">
        {products.map(product => (
          <div
            key={product.id}
            className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/30 transition-colors group relative"
          >
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-medium group-hover:text-white transition-colors leading-tight">
                {product.title}
              </p>
              {product.locked && (
                <span className="text-[10px] text-[#c10002]">🔒</span>
              )}
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-500 italic">
                Stage-{product.stage} (v{product.currentPromptVersion})
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                ${product.price}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold uppercase tracking-tighter">
                Edit
              </button>
              <button className="flex-1 py-1 bg-[#c10002]/20 hover:bg-[#c10002]/40 text-[#ff4d4d] rounded text-[10px] font-bold uppercase tracking-tighter">
                Promote
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-lg mt-4 py-10">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">
            No items
          </span>
        </div>
      )}
    </div>
  )
}
