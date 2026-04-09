'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GuideImage {
  filename: string;
  url: string;
  timestamp: string;
  era: 'Present' | 'Historical' | 'Unknown';
}

export default function GuideGalleryPage() {
  const [images, setImages] = useState<GuideImage[]>([]);
  const [filter, setFilter] = useState<'All' | 'Present' | 'Historical'>('All');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GuideImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/gallery/guide');
        const data = await res.json();
        if (data.success) {
          setImages(data.images);
        }
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h2 className="text-purple-500 font-mono tracking-widest uppercase mb-2">Portfolio</h2>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter italic">VIRTUAL MODEL</h1>
          <p className="text-slate-400 font-light max-w-lg">
            보라색 머리 소녀의 모든 착장과 스타일링 기록입니다. 
            그녀는 단순한 가이드를 넘어, 유네스코의 문명을 투영하는 아이콘이 됩니다.
          </p>
        </div>
        <Link 
          href="/travelogue"
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300"
        >
          돌아가기
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex gap-4 mb-12 border-b border-white/5 pb-8 overflow-x-auto">
            {['All', 'Present', 'Historical'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "All" | "Present" | "Historical")}
                className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${filter === f ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {images
              .filter(img => filter === 'All' || img.era === filter)
              .map((img, index) => (
                <div 
                  key={img.filename} 
                  onClick={() => setSelectedImage(img)}
                  className={`group cursor-pointer relative aspect-[3/4] overflow-hidden rounded-3xl bg-slate-900 border border-white/5 transition-all duration-500 hover:scale-[1.02] ${index === 0 ? 'ring-2 ring-purple-500 ring-offset-4 ring-offset-slate-950' : ''}`}
                >
                  <Image 
                    src={img.url} 
                    alt={`Outfit ${index}`}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  {/* Overlay Info */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm inline-block w-fit mb-2 uppercase tracking-tighter ${img.era === 'Present' ? 'bg-blue-500 text-white' : 'bg-purple-600 text-white'}`}>
                      {img.era}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {img.timestamp === 'Current' ? 'Latest Look' : (img.timestamp.split('_')[0] || 'Unknown Date')}
                    </span>
                  </div>

                  {/* Index Number */}
                  <div className="absolute top-6 left-6 text-4xl font-black text-white/10 italic group-hover:text-purple-500/30 transition-colors">
                    {String(images.length - index).padStart(2, '0')}
                  </div>
                </div>
              ))}
            
            {images.length === 0 && (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-white/10 rounded-3xl">
                <span className="text-6xl mb-4 block opacity-20">👗</span>
                <p className="text-slate-500">아직 가이드의 사진이 없습니다.<br/>성 탐방기에서 새로운 사진을 던져주세요!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Decoration */}
      <div className="mt-32 text-center opacity-10 pointer-events-none">
        <span className="text-[15vw] font-black tracking-tighter select-none leading-none">LOOKBOOK</span>
      </div>

      {/* Image Modal (Lightbox) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative w-full h-full max-w-5xl flex flex-col items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs font-bold tracking-widest transition-all backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
            >
              ✕ CLOSE
            </button>
            <img 
              src={selectedImage.url} 
              alt="Full view" 
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
            {/* Modal Info Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-4 pointer-events-none">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter ${selectedImage.era === 'Present' ? 'bg-blue-500 text-white' : 'bg-purple-600 text-white'}`}>
                {selectedImage.era}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {selectedImage.timestamp === 'Current' ? 'LATEST' : selectedImage.timestamp}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
