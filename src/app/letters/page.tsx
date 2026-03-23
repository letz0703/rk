"use client"

import { useState } from "react"
import { ref, push } from "firebase/database"
import { database } from "../../api/firebase"

export default function LettersPage() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    await push(ref(database, "letters"), {
      name: name.trim() || "Anonymous",
      message: message.trim(),
      createdAt: Date.now(),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">Letters to rainskiss</h1>
        <p className="text-gray-400 mb-8 text-sm">
          Leave a message, a request, or just say hello. Every letter is read.
        </p>

        {sent ? (
          <div className="bg-green-900/50 border border-green-600 rounded-xl p-8 text-center">
            <p className="text-2xl mb-2">💌</p>
            <p className="text-green-300 font-semibold text-lg">Your letter was sent!</p>
            <p className="text-gray-400 text-sm mt-2">Thank you for writing.</p>
            <button
              onClick={() => { setSent(false); setName(""); setMessage("") }}
              className="mt-6 px-5 py-2 rounded-full border border-white/20 text-sm hover:bg-white/10 transition"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name or nickname"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={6}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Letter"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
