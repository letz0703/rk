"use client"

import {useEffect, useState} from "react"
import {getProducts} from "@/api/firebase"
import AuthButtons from "./AuthButton"
import {useAuthContext} from "@/components/context/AuthContext"

export default function ListBgm() {
  const {user} = useAuthContext()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)

    const timeout = setTimeout(() => setLoading(false), 7000)

    const detach = getProducts(
      (arr = []) => {
        clearTimeout(timeout)
        setItems(arr)
        setLoading(false)
      },
      err => {
        clearTimeout(timeout)
        setError(err?.message || "권한/네트워크 오류")
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(timeout)
      if (typeof detach === "function") detach()
    }
  }, [user])

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">로그인 후 이용하세요.</p>
        <AuthButtons />
      </div>
    )
  }

  if (loading) return <div className="p-8">Loading…</div>
  if (error) return <div className="p-8 text-red-300">ERROR CODE: {error}</div>
  if (!items.length) return <div className="p-8">No BGM Here</div>

  return (
    <div className="mt-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">RainsKiss Cloud Download </h3>
        <AuthButtons />
      </div>
      <ul className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
        {items.map(p => (
          <li
            key={p.id}
            className="bg-[#3b4355] p-4 rounded-lg shadow-md hover:shadow-lg overflow-hidden cursor-pointer"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <div className="mt-2 px-2 text-lg font-bold flex justify-between items-center">
              <h3 className="truncate">{p.title}</h3>
            </div>
            <p className="px-2 text-sm">Price: ☕️ x {p.price}</p>
            <p className="mb-2 px-2 text-gray-100 text-sm">Genre: {p.genre}</p>
            {!!p.link && (
              <p className="text-sm mt-1 px-2">
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      p.link,
                      "_blank",
                      "width=800,height=600,noopener,noreferrer"
                    )
                  }
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  download mp3
                </button>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
