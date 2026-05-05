import fs from "fs"
import path from "path"

interface Note {
  date: string
  content: string
}

function getNotes(): Note[] {
  const noteDir = path.join(process.cwd(), "note")

  if (!fs.existsSync(noteDir)) return []

  const files = fs
    .readdirSync(noteDir)
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => b.localeCompare(a))

  return files.map((file) => ({
    date: file.replace(".md", ""),
    content: fs.readFileSync(path.join(noteDir, file), "utf-8"),
  }))
}

function renderMarkdown(text: string) {
  const lines = text.split("\n")

  return lines.map((line, i) => {
    if (line.startsWith("### "))
      return (
        <p key={i} className="text-sm font-semibold text-[#c10002] mt-3">
          {line.slice(4)}
        </p>
      )
    if (line.startsWith("## "))
      return (
        <p key={i} className="text-base font-semibold text-[#c10002] mt-4">
          {line.slice(3)}
        </p>
      )
    if (line.startsWith("# "))
      return (
        <p key={i} className="text-lg font-bold text-[#c10002] mt-4">
          {line.slice(2)}
        </p>
      )
    if (line.startsWith("- "))
      return (
        <p key={i} className="text-zinc-300 pl-3 before:content-['–'] before:mr-2 before:text-zinc-500">
          {line.slice(2)}
        </p>
      )
    if (line.trim() === "")
      return <div key={i} className="h-2" />

    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-zinc-300 leading-relaxed">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="text-white font-semibold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    )
  })
}

export default function NotePage() {
  const notes = getNotes()

  return (
    <main className="min-h-screen bg-[#100002] text-zinc-300 px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-xs uppercase tracking-widest text-zinc-600 mb-12">note</h1>

      {notes.length === 0 && (
        <p className="text-zinc-600 text-sm">~/projects/rk/note/ 폴더에 .md 파일을 추가하세요.</p>
      )}

      <div className="flex flex-col gap-12">
        {notes.map((note) => (
          <article key={note.date}>
            <time className="block text-xs text-zinc-600 mb-4 tracking-wider">
              {note.date}
            </time>
            <div className="border-l border-zinc-800 pl-4 space-y-1">
              {renderMarkdown(note.content)}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
