"use client"

import Image from "next/image"
import Link from "next/link"
import {ImYoutube2} from "react-icons/im"

export default function Projects() {
  return (
    <div>
      <header className="flex justify-between border-b border-gray-300 p-2">
        <Link href="/" className="flex items-center text-2xl text-brand">
          <h1>💭 rainskiss 🦋</h1>
        </Link>

        <nav className="flex items-center gap-4 font-semibold">
          <ul className="space-y-4 text-lg">
            <li>
              <Link
                href="https://www.youtube.com/@rainskiss.m/"
                target="_blank"
                className="flex items-center text-sm"
              >
                <ImYoutube2 className="text-6xl" />
                {/*@rainskiss.m*/}
              </Link>
            </li>
            <li>
              <Link
                href="https://suno.com/invite/@rainskiss_o/"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                SUNO Music
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="flex justify-between">
        <Image
          src="/albumns.jpg"
          alt="rainskiss albumns"
          width={3480}
          height={2160}
        />
      </div>
    </div>
  )
}
