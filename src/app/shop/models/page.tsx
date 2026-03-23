import Link from "next/link"

export default function ShopModelsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block">
          ← Back to Shop
        </Link>
        <h1 className="text-4xl font-extrabold text-[#c10002] mb-2">🔞 Model Photobooks</h1>
        <p className="text-gray-400 mb-10 text-sm">
          Artistic adult content from fictional muses. Exclusive to Patreon members.
        </p>

        {/* Patreon gate */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
          <p className="text-5xl mb-5">🔒</p>
          <h2 className="text-xl font-bold text-white mb-2">Members Only</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
            This content is exclusively available to Patreon supporters.
            Join to get full access to all model galleries and future releases.
          </p>
          <a
            href="https://patreon.com/rainskiss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition text-base"
          >
            Join on Patreon
          </a>
          <p className="mt-4 text-xs text-gray-600">
            Already a member?{" "}
            <a
              href="https://www.patreon.com/rainskiss/posts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline"
            >
              Go to Patreon posts →
            </a>
          </p>
        </div>

        {/* Tease — DeviantArt */}
        <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-3xl">🎨</div>
          <div className="flex-1">
            <p className="text-sm text-gray-300 font-semibold">Free previews on DeviantArt</p>
            <p className="text-xs text-gray-500 mt-1">Some content is available for free on DeviantArt rainskiss-x.</p>
          </div>
          <a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-white/20 text-sm hover:bg-white/10 transition whitespace-nowrap"
          >
            Visit DeviantArt →
          </a>
        </div>
      </div>
    </div>
  )
}
