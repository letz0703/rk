"use client"
import Link from "next/link"
import User from "./User"

export default function Nav() {
  return (
    <>
      <nav className="flex">
        <div className="px-2">
          <Link href="/">Home </Link>
        </div>
        <User />
      </nav>
    </>
  )
}
