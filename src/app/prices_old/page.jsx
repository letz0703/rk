// app/price/page.jsx
"use client"

import {useState} from "react"
import {prices} from "../data/prices"

export default function PriceLookup() {
  const [query, setQuery] = useState("")
  const q = query.toLowerCase()

  const filtered = prices.filter(
    item =>
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q)
  )

  return (
    <main className="min-h-screen bg-slate-800 text-slate-100 p-6">
      <h1 className="text-2xl font-semibold">Price Lookup</h1>
      <p className="text-slate-400 mt-1">
        Reference only · Not for online sale
      </p>

      <input
        placeholder="Search product or brand"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="
          w-full mt-4 px-4 py-3 rounded-md
          bg-slate-700 text-white
          placeholder-slate-400
          border border-slate-600
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />

      <section className="mt-6 divide-y divide-slate-600">
        {filtered.map(item => (
          <div key={item.id} className="py-3">
            <strong className="block text-lg">
              {item.brand} · {item.name}
            </strong>
            <div className="text-slate-200">{item.price}</div>
            {item.note && <small className="text-slate-400">{item.note}</small>}
          </div>
        ))}
      </section>
    </main>
  )
}
