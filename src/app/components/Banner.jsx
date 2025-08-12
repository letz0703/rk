"use client"
import Image from "next/image"

export default function Banner() {
  return (
    // 화면 가로 전체 + 부모 패딩 무시: w-screen + left-1/2 -translate-x-1/2
    <section className="relative w-screen left-1/2 -translate-x-1/2 h-[420px] overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/albumns.jpg"
        alt="banner"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* (옵션) 살짝 어둡게 */}
      {/* <div className="absolute inset-0 bg-black/30" /> */}

      {/* 텍스트 레이어 */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-5xl px-6">
          <h2 className="text-5xl md:text-6xl font-bold  text-[#c10002]">
            RAINSKISS
          </h2>
          <p className="mt-3 text-sm md:text-xl max-w-2xl drop-shadow-lg text-gray-800 drop-shado-md">
            The sound of rain kissing the earth, <br />
            the most beautiful music in the world.
          </p>
        </div>
      </div>
    </section>
  )
}
