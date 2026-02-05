import Link from "next/link"
import Image from "next/image"

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#fdf5f5] text-gray-900 flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#c10002] drop-shadow-sm">
          rainskiss digital shop
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Background music, intimate visuals, and exclusive emotional assets.
          <br />
          Every item is handcrafted with beauty and care.
        </p>

        {/* MUSIC CARD */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg flex flex-col sm:flex-row items-center gap-6 p-5 text-left">
          <Image
            src="/covers/candy-ghost.jpg" // public 디렉토리 기준 이미지
            alt="CANDY GHOST cover"
            width={160}
            height={160}
            className="rounded-md object-cover"
          />
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold text-[#c10002]">CANDY GHOST, PUT THE CAMERA DOWN</h2>
            <p className="text-sm text-gray-700">
              Groove-first indie track with an aggressive lo-fi attitude. No polish, no reverb. Just raw rhythm and satire.
            </p>
            <a
              href="https://suno.com/song/c2ca72ed-406d-4044-9582-f0c65c5c0c26"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-1.5 rounded-full bg-[#c10002] text-white text-sm hover:bg-[#a60000] transition"
            >
              Listen on Suno →
            </a>
          </div>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
          <Link
            href="/shop/music"
            className="block bg-white border border-gray-300 rounded-xl p-6 hover:bg-gray-100 transition shadow text-left"
          >
            <h2 className="text-xl font-semibold text-[#c10002] mb-2">🎵 MUSIC</h2>
            <p className="text-sm text-gray-700">
              Original BGM, ambient loops, and cinematic themes. Download and use freely or commercially.
            </p>
          </Link>

          <Link
            href="/shop/models"
            className="block bg-white border border-gray-300 rounded-xl p-6 hover:bg-gray-100 transition shadow text-left"
          >
            <h2 className="text-xl font-semibold text-[#c10002] mb-2">🔞 MODEL PHOTOBOOKS</h2>
            <p className="text-sm text-gray-700">
              Artistic adult photobooks from fictional muses. Each model has their own profile and gallery.
            </p>
          </Link>
        </div>

        <div className="pt-10">
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-full border border-[#c10002] text-[#c10002] font-medium hover:bg-[#ffe5e5] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
