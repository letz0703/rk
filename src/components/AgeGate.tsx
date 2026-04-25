"use client"

import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"

export default function AgeGate({children}: {children: React.ReactNode}) {
  const router = useRouter()
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("age_verified")
    setVerified(stored === "true")
  }, [])

  function confirm() {
    sessionStorage.setItem("age_verified", "true")
    setVerified(true)
  }

  function deny() {
    router.push("/")
  }

  if (verified === null) return null

  if (!verified) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl">
          <p className="text-4xl mb-4">🔞</p>
          <h2 className="text-xl font-bold text-white mb-2">Adults Only</h2>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            This content contains mature themes intended for adults 18 and
            older. Please confirm your age to continue.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={confirm}
              className="w-full py-3 rounded-full font-semibold text-white transition hover:opacity-80"
              style={{backgroundColor: "#c10002"}}
            >
              I am 18 or older — Enter
            </button>
            <button
              onClick={deny}
              className="w-full py-3 rounded-full font-semibold text-white/40 border border-white/10 hover:bg-white/5 transition text-sm"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
