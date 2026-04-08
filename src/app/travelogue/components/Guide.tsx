'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GuideProps {
  message: string;
  timeMode: 'present' | 'past';
}

export default function Guide({ message, timeMode }: GuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [customGuideImages, setCustomGuideImages] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setCustomGuideImages(prev => ({ ...prev, [timeMode]: localUrl }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'guide');
      formData.append('mode', timeMode);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setCustomGuideImages(prev => ({ ...prev, [timeMode]: data.url }));
        }
      } catch (err) {
        console.error('가이드 업로드 실패:', err);
      }
    }
  };

  const currentImage = customGuideImages[timeMode] || `/travelogue/guide_main_${timeMode}.png`;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={`fixed bottom-10 right-10 z-50 flex flex-col items-end transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      
      {/* Speech Bubble */}
      <div className="relative mb-4 max-w-[250px] bg-white/10 backdrop-blur-md p-5 rounded-2xl rounded-br-none border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 group">
        <p className="text-white text-sm leading-relaxed font-medium">
          {message}
        </p>
        
        {/* Pointer */}
        <div className="absolute bottom-[-10px] right-0 w-0 h-0 border-l-[15px] border-l-transparent border-t-[10px] border-t-white/10" />
      </div>

      {/* Character Image Drop Zone & Link to Gallery */}
      <Link href="/travelogue/gallery" className="group">
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-32 h-40 transform hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          {/* Tooltip on hover */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            그녀의 화보 보러가기 ➔
          </div>

          {/* Placeholder Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-400 rounded-full blur-xl opacity-20 animate-pulse" />
          
        {customGuideImages[timeMode] ? (
          <img 
            src={customGuideImages[timeMode]} 
            alt={`Custom Guide ${timeMode}`} 
            className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-in fade-in duration-500"
            onError={() => {
              setCustomGuideImages(prev => {
                const updated = { ...prev };
                delete updated[timeMode];
                return updated;
              });
            }}
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={`/travelogue/guide_main_${timeMode}.png`}
              alt="Guide Character"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Character Fallback (If image missing) */}
            <div className="absolute inset-4 border-2 border-dashed border-purple-400/50 rounded-full flex flex-col items-center justify-center -z-10 bg-slate-800/80">
              <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">
                {timeMode === 'present' ? '🙋‍♀️' : '👸'}
              </span>
              <span className="text-[8px] text-purple-400 font-bold uppercase tracking-tighter">
                {timeMode} style
              </span>
            </div>
          </div>
        )}
        </div>
      </Link>
    </div>
  );
}
