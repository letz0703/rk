"use client"

import Link from "next/link"
import {useEffect, useState} from "react"

type UserData = {
  displayName?: string
  photoURL?: string
}

export default function User() {
  const [user, setUser] = useState<UserData | null>(null)

  const loadUser = () => {
    const localUser = localStorage.getItem("user")
    try {
      if (localUser) {
        const parsed = JSON.parse(localUser) as UserData
        setUser(parsed)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.log(err)
      setUser(null)
    }
  }

  useEffect(() => {
    loadUser()

    const handler = () => loadUser()
    window.addEventListener("userChanged", handler)

    return () => window.removeEventListener("userChanged", handler)
  }, [])

  if (!user) return null

  return (
    <>
      <Link href="/downloads" className="hidden md:block mr-2">
        BGM
      </Link>
      <Link href="/bgm" className="hidden md:block mr-2">
        Lofi·Classic
      </Link>
    </>
  )
}
