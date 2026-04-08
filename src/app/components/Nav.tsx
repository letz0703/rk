"use client"
import LoginButton from "./LoginButton"
import User from "./User"

export default function Nav() {
  return (
    <>
      <nav className="flex">
        <div className="px-2">
          <a href="/">Home </a>
        </div>
        <User />
        {/*<LoginButton />*/}
        <CheckAdminButton />
      </nav>
    </>
  )
}
