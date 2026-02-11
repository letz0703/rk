"use client"

import {useState, useMemo} from "react"
import Link from "next/link"
import sets from "../../api/data/sets.json"
import {searchSets} from "../../lib/searchSets"

export default function SetPage() {
  const [search, setSearch] = useState("")

  const filteredSets = useMemo(() => {
    return searchSets(sets, search)
  }, [search])

  return (
    <div style={{padding: 40}}>
      <input
        type="text"
        placeholder="Search sets..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filteredSets.map(set => (
        <Link key={set.id} href={`/set/${set.id}`}>
          <div>{set.title}</div>
        </Link>
      ))}
    </div>
  )
}
