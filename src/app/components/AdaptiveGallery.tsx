import Image from "next/image"

type AdaptiveGalleryProps = {
  images: string[]
  caption?: string
  ctaHref?: string
  ctaLabel?: string
}

export default function AdaptiveGallery({
  images,
  caption = "GALLERY",
  ctaHref = "#top",
  ctaLabel = "Like what you see? Get the prompt ↑",
}: AdaptiveGalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <section className="bg-[#0e0e0e] border-t border-white/10 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-baseline gap-3 mb-8">
          <span className="text-xs uppercase tracking-widest text-white/40">{caption}</span>
          <span className="text-xs text-white/25">{images.length} SHOTS</span>
        </div>

        <div className="flex flex-col gap-6">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={url}
                alt=""
                fill
                className="object-cover object-top hover:scale-[1.02] transition duration-500"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ))}
        </div>

        <a
          href={ctaHref}
          className="mt-10 block text-center text-sm text-white/50 hover:text-white transition"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  )
}
