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
          Artistic adult content from fictional muses.
        </p>

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
