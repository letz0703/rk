"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import Image from "next/image"

export default function Page() {
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const ok = sessionStorage.getItem("adult-confirmed")
    if (ok === "true") setConfirmed(true)
  }, [])

  const handleConfirm = () => {
    sessionStorage.setItem("adult-confirmed", "true")
    setConfirmed(true)
  }

  const handleReject = () => {
    router.replace("/")
  }

  return (
    <div
      className="w-screen min-h-screen text-white flex items-center justify-center"
      style={{backgroundColor: "#c10002"}}
    >
      {!confirmed ? (
        <div className="bg-black/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">18+ Content</h1>
          <p className="text-gray-200 text-base leading-relaxed">
            This page contains adult content.
            <br />
            Are you 18 or older?
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              Yes
            </button>
            <button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center text-center px-4">
          <Image
            src="/logo-rk.svg"
            alt="rainskiss logo"
            width={120}
            height={50}
            className="mb-6"
          />
          <h2 className="text-2xl font-bold text-white">
            Welcome to the adult area
          </h2>
          <p className="text-gray-200 mt-2">You have verified your age.</p>
          <a
            href="https://grok.com/share/c2hhcmQtNA_864e4eed-d17d-402a-b407-db3a467492af"
            target="_blank"
            rel="noopener noreferrer"
            className="m-2 inline-block bg-white text-[#c10002] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            bodycopy
          </a>
          <a
            href="https://chatgpt.com/g/g-696c622fabd88191bfb6227cbd1d7268-bodycopy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#c10002] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            soft
          </a>
        </div>
      )}
    </div>
  )
}
