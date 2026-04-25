import Link from "next/link"
import Image from "next/image"
import {shopProducts} from "@/data/shop-products"

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-3">
            AI Clothing Prompt Store
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            RAINSKISS{" "}
            <span style={{color: "#c10002"}}>COLLECTION</span>
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
            Free Flow previews are released daily on DeviantArt.
            <br />
            Purchase the explicit Grok edition here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopProducts.map(product => (
            <Link
              key={product.slug}
              href={`/shop/${product.slug}`}
              className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition"
            >
              <div className="relative w-full aspect-[3/4] bg-white/5">
                <Image
                  src={product.previewImage}
                  alt={product.title.en}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                    Flow Preview
                  </p>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {product.title.en}
                  </h2>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <p className="text-sm text-white/50">{product.tagline.en}</p>
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full text-white flex-shrink-0"
                  style={{backgroundColor: "#c10002"}}
                >
                  {product.price}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-10 text-center">
          <p className="text-xs text-white/30 mb-2">
            Free Flow content available daily on
          </p>
          <a
            href="https://deviantart.com/rainskiss-x"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition"
          >
            DeviantArt / rainskiss-x ↗
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-white/20 hover:text-white/40 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
