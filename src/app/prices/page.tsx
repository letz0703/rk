"use client"

import {useEffect, useState, useCallback} from "react"
import {ref, get, push} from "firebase/database"
import {database} from "../../api/firebase"

type Product = {
  id: string
  category: string
  brand: string
  name: string
  price: string
  purchasePrice: string | null
  quantity: string
  purchasedAt: string
}

export default function PublicPriceSearchPage() {
  const [items, setItems] = useState<Product[]>([])
  const [query, setQuery] = useState("")
  const [newText, setNewText] = useState("")

  // ================= FETCH =================
  const fetchData = useCallback(async () => {
    const snapshot = await get(ref(database, "products"))

    if (snapshot.exists()) {
      const data = Object.entries(snapshot.val()).map(([key, value]: any) => ({
        id: key,
        ...value
      }))
      setItems(data)
    } else {
      setItems([])
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ================= SEARCH (ALL FIELDS) =================
  const results = items.filter(item => {
    const fullText = Object.values(item).join(" ").toLowerCase()
    return fullText.includes(query.toLowerCase())
  })

  // ================= REGISTER =================
  const handleRegister = async () => {
    if (!newText.trim()) return

    const parts = newText.trim().split(/\s+/)

    if (parts.length < 8) {
      alert(
        "Format: id category brand name price purchasePrice quantity purchasedAt"
      )
      return
    }

    const [
      id,
      category,
      brand,
      name,
      price,
      purchasePrice,
      quantity,
      purchasedAt
    ] = parts

    await push(ref(database, "products"), {
      id,
      category,
      brand,
      name,
      price,
      purchasePrice: purchasePrice === "null" ? null : purchasePrice,
      quantity,
      purchasedAt
    })

    setNewText("")
    fetchData()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex justify-center">
      <div className="w-[1000px] px-8 py-12">
        <h1 className="text-2xl font-semibold mb-8">Price Search</h1>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search product..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />

        {/* RESULTS */}
        <div className="mt-8 space-y-4">
          {results.map(item => (
            <div
              key={item.id}
              className="p-4 bg-slate-800 border border-slate-700 rounded-lg"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">
                    {item.brand} {item.name}
                  </div>
                  <div className="text-xs text-slate-400">{item.category}</div>
                </div>

                <div className="text-blue-400 font-bold">
                  ₩{Number(item.price).toLocaleString()}
                </div>
              </div>

              <div className="text-xs text-slate-400 mt-2">
                Stock: {item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* NO RESULT → REGISTER */}
        {query && results.length === 0 && (
          <div className="mt-10">
            <div className="text-slate-400 mb-3">No results. Add new?</div>

            <input
              type="text"
              placeholder="id category brand name price purchasePrice quantity purchasedAt"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleRegister()
                }
              }}
              className="w-full p-3 mb-3 bg-slate-800 border border-slate-700 rounded-lg"
            />

            <button
              onClick={handleRegister}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
