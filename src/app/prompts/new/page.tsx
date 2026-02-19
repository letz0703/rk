"use client"

import {useState} from "react"
import {ref, push} from "firebase/database"
import {database} from "../../../api/firebase"

function generateSearchText(title: string, content: string) {
  const clean = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, " ")
      .trim()

  return clean(title + " " + content)
}

export default function NewPromptPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !content) return

    setLoading(true)

    const searchText = generateSearchText(title, content)

    await push(ref(database, "prompts"), {
      title,
      content,
      searchText,
      createdAt: Date.now()
    })

    setTitle("")
    setContent("")
    setLoading(false)
  }

  return (
    <div style={{padding: 40}}>
      <h1>New Prompt</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{width: "100%", padding: 10, marginBottom: 20}}
      />

      <textarea
        placeholder="Prompt content (one-liner)"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={8}
        style={{width: "100%", padding: 10, marginBottom: 20}}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Prompt"}
      </button>
    </div>
  )
}
