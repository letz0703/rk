"use client"

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
    <div>
      <img src={user.photoURL} alt="user" />
    </div>
  )
}
