"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Download, Play, Music, ArrowLeft, ExternalLink, Film } from "lucide-react"

// ==========================================
// 💡 [관리자용 안내] 뮤직 비디오 정보 및 다운로드 링크 수정 구역
// 여기에 새로운 뮤직비디오를 추가하거나 다운로드 링크(downloadUrl)를 직접 수정하실 수 있습니다.
// ==========================================
const MUSIC_VIDEOS = [
  {
    id: "qSEDD5l6JkQ",
    title: "RAINSKISS - Main Theme MV",
    description: "독창적인 비주얼과 감각적인 사운드가 결합된 RAINSKISS의 시그니처 공식 뮤직비디오입니다. 몽환적인 분위기와 정밀한 사운드 텍스처를 느껴보세요.",
    youtubeUrl: "https://youtu.be/qSEDD5l6JkQ",
    // 👇 아래 다운로드 링크를 원하는 파일 주소(예: 클라우드 링크나 public 폴더 내 파일 경로)로 수정하세요.
    downloadUrl: "https://example.com/download/rainskiss-main-theme.mp4",
    tags: ["Main Theme", "Electronic", "Visual Art"],
    duration: "3:45"
  },
  {
    id: "example-video-2",
    title: "RAINSKISS - Ambient Motion (Sample)",
    description: "미니멀리즘과 공간감이 돋보이는 두 번째 비디오 샘플입니다. 본인의 음악 및 영상을 등록하여 포트폴리오를 완성해 보세요.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // 예시 유튜브 링크
    // 👇 아래 다운로드 링크를 수정하세요.
    downloadUrl: "https://example.com/download/rainskiss-ambient-motion.mp4",
    tags: ["Ambient", "Chillout", "Lo-Fi"],
    duration: "4:12"
  }
]

export default function MusicVideoPage() {
  const [selectedVideo, setSelectedVideo] = useState(MUSIC_VIDEOS[0])

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] font-sans text-gray-100 antialiased overflow-x-hidden">
      {/* 백그라운드 디자인 - 은은한 레드 글로우 및 그리드 패턴 */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(100% 70% at 50% -10%, rgba(193, 0, 2, 0.18), transparent 60%)"
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0 1px, transparent 0 10px)"
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-md px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/public" 
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c10002]">
              Music Video Archive
            </span>
          </div>
          
          <Link href="/" className="text-sm font-bold uppercase tracking-[0.4em] text-white">
            RAINSKISS
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-[1400px] px-6 py-10 md:px-10" id="main-content">
        {/* 히어로 타이틀 */}
        <div className="mb-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#c10002]/30 bg-[#c10002]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#c10002]"
          >
            <Film className="h-3.5 w-3.5" />
            <span>Featured Music Video</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            SOUNDS &amp; <span className="text-[#c10002] italic font-serif">VISIONS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400"
          >
            음악과 비주얼 아트의 경계를 허무는 특별한 비디오 콜렉션입니다. 
            아래에서 감상하고 원본 음원 및 영상을 다운로드하세요.
          </motion.p>
        </div>

        {/* 2단 레이아웃 (좌: 플레이어 및 소개 / 우: 리스트 및 다운로드 링크) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* 좌측: 비디오 플레이어 & 상세 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-[#c10002]/5"
            >
              {/* YouTube Embed */}
              <iframe
                key={selectedVideo.id}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=0&rel=0&showinfo=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
              />
            </motion.div>

            {/* 비디오 정보 카드 (Glassmorphism) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-mono text-gray-500">Duration: {selectedVideo.duration}</span>
              </div>

              <h2 className="text-2xl font-bold text-white">{selectedVideo.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400 whitespace-pre-line">
                {selectedVideo.description}
              </p>

              {/* 다운로드 버튼 및 소스 수정 관련 안내 */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-white/5 pt-6">
                <a
                  id={`dl-btn-${selectedVideo.id}`}
                  href={selectedVideo.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-white text-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Video / Audio</span>
                </a>
                
                <a
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 hover:border-white/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open in YouTube</span>
                </a>
              </div>
              <p className="mt-3 text-[11px] text-gray-500 italic">
                * 다운로드 버튼 클릭 시 파일이 저장되거나 다운로드 페이지로 이동합니다.
              </p>
            </motion.div>
          </div>

          {/* 우측: 뮤직 비디오 재생목록 & 선택 */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 px-1">
              Select Video
            </h3>

            <div className="space-y-4">
              {MUSIC_VIDEOS.map((video, idx) => {
                const isSelected = selectedVideo.id === video.id
                return (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * idx }}
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`group w-full text-left rounded-xl border p-4 transition-all duration-300 ${
                      isSelected 
                        ? "border-[#c10002] bg-[#c10002]/5 shadow-lg shadow-[#c10002]/5" 
                        : "border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* 미니 썸네일 플레이스홀더 (유튜브 임베드 썸네일 사용) */}
                      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-gray-800 border border-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                          alt={video.title} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            // 유튜브 이미지가 없을 경우 대체 이미지
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop"
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className={`h-4 w-4 transition-transform ${isSelected ? "text-[#c10002] scale-110" : "text-white group-hover:scale-110"}`} />
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <h4 className={`text-xs font-bold transition-colors line-clamp-1 ${isSelected ? "text-[#c10002]" : "text-white group-hover:text-[#c10002]"}`}>
                            {video.title}
                          </h4>
                          <p className="mt-1 text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        </div>
                        <span className="mt-2 text-[10px] font-mono text-gray-500">{video.duration}</span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* 다운로드 관리 팁 카드 */}
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.005] p-5">
              <div className="flex gap-3">
                <Music className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">다운로드 링크 수정 팁</h4>
                  <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                    이 페이지 파일(<code className="text-gray-300">src/app/mv/page.tsx</code>) 최상단의 <code className="text-gray-300">MUSIC_VIDEOS</code> 배열에서 <code className="text-gray-300">downloadUrl</code> 값을 원하시는 외부 저장소(Google Drive, Dropbox 등)나 로컬 파일 경로로 바로 수정하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 mt-20">
        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-10">
          <p className="text-xs tracking-wide text-gray-500">
            © 2026 RAINSKISS · Design &amp; Direction. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
