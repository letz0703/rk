"use client"

import {login} from "../../api/firebase"

export default function LoginButton() {
  return (
    <button className="text-blue-700" onClick={login}>
      login
    </button>
  )
}
