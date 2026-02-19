"use client"

import {useEffect, useState, useMemo} from "react"
import {ref, get} from "firebase/database"
import {db} from "../../../api/firebase"
import Fuse from "fuse.js"

export default function PromptSearchPage() {
  const [prompts, setPrompts] = useState<any[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchPrompts = async () => {
      const snapshot = await get(ref(db, "prompts"))
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val())
        setPrompts(data as any[])
      }
    }
    fetchPrompts()
  }, [])

  const results = useMemo(() => {
    if (!query) return prompts

    const fuse = new Fuse(prompts, {
      keys: ["title", "searchText", "content"],
      threshold: 0.3
    })

    return fuse.search(query).map(r => r.item)
  }, [query, prompts])

  return (
    <div style={{padding: 40}}>
      <input
        type="text"
        placeholder="Search prompts..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 18,
          marginBottom: 30
        }}
      />

      {results.map(prompt => (
        <div key={prompt.id} style={{marginBottom: 40}}>
          <h3>{prompt.title}</h3>
          <pre style={{whiteSpace: "pre-wrap"}}>{prompt.content}</pre>
        </div>
      ))}
    </div>
  )
}
