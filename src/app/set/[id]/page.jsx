"use client"

import {useState, useEffect} from "react"
import {useParams, useRouter} from "next/navigation"
import {ref, get, set} from "firebase/database"
import {database} from "../../../api/firebase"
import sets from "../../../api/data/sets.json"

export default function SetDetail() {
  const params = useParams()
  const router = useRouter()

  const setData = sets.find(s => s.id === params?.id)

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return

    const loadData = async () => {
      try {
        const snapshot = await get(ref(database, `setContents/${params.id}`))
        if (snapshot.exists()) {
          setText(snapshot.val())
        } else {
          setText("")
        }
      } catch (err) {
        console.error("Load error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params?.id])

  const saveContent = async () => {
    await set(ref(database, `setContents/${params.id}`), text)
    alert("Saved")
  }

  if (!setData) return <div>Not found</div>

  return (
    <div style={{padding: 40, maxWidth: 900, margin: "0 auto"}}>
      <button
        onClick={() => router.push("/set")}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          backgroundColor: "#555",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        ← Back to List
      </button>

      <h1>{setData.title}</h1>
      <p>{setData.description}</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            style={{
              width: "100%",
              height: 300,
              marginTop: 20,
              padding: 16,
              backgroundColor: "#ffffff",
              color: "#111111",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16
            }}
          />

          <button
            onClick={saveContent}
            style={{
              marginTop: 20,
              padding: "12px 24px",
              backgroundColor: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Save
          </button>
        </>
      )}
    </div>
  )
}
