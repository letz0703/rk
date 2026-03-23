import Image from "next/image"
import Link from "next/link"

const tracks = [
  {
    title: "CANDY GHOST, PUT THE CAMERA DOWN",
    description: "Groove-first indie track with an aggressive lo-fi attitude. No polish, no reverb. Just raw rhythm and satire.",
    cover: "/covers/candy-ghost.jpg",
    suno: "https://suno.com/song/c2ca72ed-406d-4044-9582-f0c65c5c0c26",
    patreon: "https://patreon.com/rainskiss",
  },
  {
    title: "Gentle Breeze 07",
    description: "Soft ambient nature loop. Free for non-commercial use with subscription.",
    cover: "/covers/Gentle Breeze.png",
    suno: "https://suno.com/playlist/e427a63e-c2e4-4df6-a5b9-b5b44bd7f5c7",
    patreon: "https://patreon.com/rainskiss",
  },
]

export default function ShopMusicPage() {
  return (
    <div className="min-h-screen bg-[#fdf5f5] text-gray-900 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Back to Shop
        </Link>
        <h1 className="text-4xl font-extrabold text-[#c10002] mb-2">🎵 Music</h1>
        <p className="text-gray-600 mb-10 text-sm">
          Original BGM, ambient loops, and cinematic themes by rainskiss.
          <br />
          Non-commercial use free after subscription · Commercial license via{" "}
          <a href="https://patreon.com/rainskiss" target="_blank" rel="noopener noreferrer" className="text-[#c10002] underline">
            Patreon
          </a>
        </p>

        <div className="space-y-6">
          {tracks.map((track, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow flex flex-col sm:flex-row gap-5 p-5"
            >
              <Image
                src={track.cover}
                alt={track.title}
                width={140}
                height={140}
                className="rounded-lg object-cover w-full sm:w-36 h-36"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#c10002] mb-1">{track.title}</h2>
                  <p className="text-sm text-gray-600">{track.description}</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href={track.suno}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full bg-[#c10002] text-white text-sm hover:bg-[#a60000] transition"
                  >
                    Listen on Suno →
                  </a>
                  <a
                    href={track.patreon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
                  >
                    Get License on Patreon
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-700 mb-3">
            Want unlimited downloads &amp; commercial use rights?
          </p>
          <a
            href="https://patreon.com/rainskiss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition"
          >
            Support on Patreon
          </a>
        </div>
      </div>
    </div>
  )
}
