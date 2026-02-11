"use client"

import {useState, useMemo} from "react"
import Link from "next/link"
import sets from "../../api/data/sets.json"
import {searchSets} from "../../lib/searchSets"

export default function SetPage() {
  const [search, setSearch] = useState("")

  const filteredSets = useMemo(() => {
    return searchSets(sets, search)
  }, [search, sets])

  return (
    <div style={{padding: 40, maxWidth: 900, margin: "0 auto"}}>
      <h1>Prompt Sets</h1>

      <input
        type="text"
        placeholder="Search sets..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          margin: "20px 0",
          fontSize: 16
        }}
      />

      {/* 🔥 결과 개수 표시 */}
      <p style={{marginBottom: 20}}>{filteredSets.length} results</p>

      <div style={{display: "grid", gap: 16}}>
        {filteredSets.map(set => (
          <Link key={set.id} href={`/set/${set.id}`}>
            <div
              style={{
                padding: 16,
                border: "1px solid #ddd",
                borderRadius: 12,
                cursor: "pointer"
              }}
            >
              <h2 style={{margin: 0}}>{set.title}</h2>
              <p style={{margin: "8px 0"}}>{set.description}</p>
              <small>{set.tags.join(", ")}</small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
