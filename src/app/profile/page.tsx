import Image from "next/image"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <Image
          src="/logo-rk.svg"
          alt="rainskiss logo"
          width={120}
          height={120}
          className="mx-auto mb-6"
          priority
        />
        <h1 className="text-2xl font-bold text-white">Chang Man Kim</h1>
        <p className="text-gray-400 mt-1 text-sm">rainskiss@gmail.com</p>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href="https://youtube.com/@rainskiss"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-red-600 text-white text-sm hover:bg-red-700 transition"
          >
            YouTube · @rainskiss
          </a>
          <a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-green-700 text-white text-sm hover:bg-green-800 transition"
          >
            DeviantArt · rainskiss-x
          </a>
          <a
            href="https://patreon.com/rainskiss"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
          >
            Patreon · Support
          </a>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="text-gray-500 text-xs hover:text-gray-300 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
