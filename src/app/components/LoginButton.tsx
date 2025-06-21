"use client"

import {useState, useEffect} from "react"
import {login, logout} from "../../api/firebase"
import {User} from "firebase/auth"

export default function LoginButton() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = async () => {
    const userData = await login()
    if (userData) {
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      window.dispatchEvent(new Event("userChanged"))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    logout()
    setUser(null)
    window.dispatchEvent(new Event("userChanged"))
  }

  return (
    <div>
      {user ? (
        <button className="text-red-500" onClick={handleLogout}>
          logout
        </button>
      ) : (
        <button className="text-blue-700" onClick={handleLogin}>
          login
        </button>
      )}
    </div>
  )
}
