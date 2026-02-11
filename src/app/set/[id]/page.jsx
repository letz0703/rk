import sets from "../../../api/data/sets.json"
import { notFound } from "next/navigation"

export default function SetDetail({ params }) {
  const set = sets.find(s => s.id === params.id)

  if (!set) return notFound()

  return (
    <div style={{ padding: 40 }}>
      <h1>{set.title}</h1>
      <p>{set.description}</p>

      <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
        {set.downloads?.map((file, index) => (
          <a
            key={index}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                padding: "12px 22px",
                backgroundColor: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={e =>
                (e.currentTarget.style.backgroundColor = "#333")
              }
              onMouseOut={e =>
                (e.currentTarget.style.backgroundColor = "#111")
              }
            >
              {file.label}
            </button>
          </a>
        ))}
      </div>
    </div>
  )
}
