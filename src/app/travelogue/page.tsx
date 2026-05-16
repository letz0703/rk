'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Guide from './components/Guide';

const scenes = [
  {
    id: 1,
    present: {
      title: "현대의 노이슈반슈타인",
      description: "오늘날 전 세계 여행자들이 찾는 웅장한 알프스의 자부심입니다. 디즈니 성의 모티브가 된 그 모습 그대로죠.",
      guideMsg: "안녕하세요! 현대의 노이슈반슈타인 성에 오신 것을 환영해요. 지금 이 모습, 정말 멋지지 않나요?"
    },
    past: {
      title: "독수리와 갈매기의 밀어",
      description: "건축왕 루드비히 2세와 그의 유일한 이해자였던 시시 황후. 그들이 '독수리'와 '갈매기'라 서로를 부르며 꿈꿨던 환상이 이 성의 벽면에 서려 있습니다.",
      guideMsg: "쉿! 여기 어디선가 루드비히 왕이 시시 황후를 위해 쓴 시의 운율이 들리는 것 같아요. 두 영혼의 슬픈 교감이 느껴지시나요?"
    }
  },
  {
    id: 2,
    present: {
      title: "관광지로 변모한 성 내부",
      description: "해마다 수백만 명의 발길이 닿는 성 안은 정교한 보존 기술을 통해 현대인들에게 감동을 선사합니다.",
      guideMsg: "성 안은 늘 활기가 넘쳐요! 전 세계의 언어들이 이곳에 울려 퍼지고 있죠."
    },
    past: {
      title: "바그너를 향한 오마주",
      description: "왕은 오직 바그너의 오페라를 위한 공간으로 이곳을 꾸몄습니다. 벽화 하나하나가 전설의 한 장면이었죠.",
      guideMsg: "쉿! 여기는 왕이 가장 사랑했던 공간이에요. 바그너의 음악 소리가 들리는 것 같지 않나요?"
    }
  },
  {
    id: 3,
    present: {
      title: "디즈니의 영감이 된 성",
      description: "현대 팝 컬처에서 가장 유명한 성의 모델이 되어 수많은 영화와 애니메이션 속에 살아 숨 쉽니다.",
      guideMsg: "아이들이 가장 좋아하는 장소예요! 디즈니 성의 '진짜' 모델을 보고 다들 깜짝 놀란답니다."
    },
    past: {
      title: "신비로운 요새의 전설",
      description: "당시 기술로는 불가능해 보였던 뾰족한 첨탑들은 산맥의 안개 속에 숨겨진 신비로운 요새처럼 보였습니다.",
      guideMsg: "이 안개 좀 보세요. 당시 사람들은 이 성이 마법으로 지어졌다고 믿기도 했답니다."
    }
  },
  {
    id: 4,
    present: {
      title: "영원한 세계유산",
      description: "다음 세대에게 물려줄 소중한 자산으로서, 2025년에도 이 성은 유네스코의 가치를 지켜가고 있습니다.",
      guideMsg: "벌써 헤어질 시간이네요. 현대의 독일 탐방은 여기까지예요. 다음 여행지도 기대해 주세요!"
    },
    past: {
      title: "못다 이룬 왕의 작별",
      description: "미완성으로 남겨진 부분마저도 예술이 된 이곳. 왕은 떠났지만 그의 꿈은 영원히 유산으로 남았습니다.",
      guideMsg: "과거로의 여행은 어떠셨나요? 역사의 한 페이지를 함께 넘겨주셔서 감사해요. 그럼 다음에 만나요!"
    }
  }
];

export default function TraveloguePage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [timeMode, setTimeMode] = useState<'present' | 'past'>('present');
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  // ref로 최신 currentScene 추적 — scroll 핸들러 재등록 방지
  const sceneRef = useRef(0);

  // timeMode를 deps에 포함 — stale closure 버그 수정
  const handleDrop = useCallback(async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // 1. 즉시 로컬 미리보기 표시 (빠른 체감)
      const localUrl = URL.createObjectURL(file);
      setCustomImages(prev => ({ ...prev, [index]: localUrl }));

      // 2. 서버(로컬 폴더)로 업로드 요청
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', `scene-${index}`);
      formData.append('mode', timeMode);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setCustomImages(prev => ({ ...prev, [`${index}_${timeMode}`]: data.url }));
        }
      } catch (err) {
        console.error('업로드 실패:', err);
        alert('이미지 저장 중 오류가 발생했습니다.');
      }
    }
  }, [timeMode]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    // ref 덕분에 deps [] 가능 — 스크롤마다 리스너 재등록 없음
    const handleScroll = () => {
      const idx = Math.floor(window.scrollY / window.innerHeight);
      if (idx < scenes.length && idx !== sceneRef.current) {
        sceneRef.current = idx;
        setCurrentScene(idx);
      }
    };

    // passive: true — 스크롤 성능 향상 (모바일 특히 효과적)
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-900 text-white selection:bg-purple-500">
      <Guide 
        message={scenes[currentScene][timeMode].guideMsg} 
        timeMode={timeMode}
      />
      
      {/* Time Shift Toggle */}
      <div className="fixed top-8 right-8 z-[60] flex items-center gap-4 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
        <button
          onClick={() => setTimeMode('present')}
          className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${timeMode === 'present' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
        >
          PRESENT
        </button>
        <button
          onClick={() => setTimeMode('past')}
          className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${timeMode === 'past' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-slate-500 hover:text-white'}`}
        >
          HISTORICAL
        </button>
      </div>

      {scenes.map((scene, index) => {
        const content = scene[timeMode];
        const imageKey = `${index}_${timeMode}`;
        
        return (
          <section 
            key={scene.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="relative h-screen flex flex-col items-center justify-center p-8 text-center sticky top-0 bg-slate-900 border-b border-white/5 transition-colors duration-1000"
          >
            {/* Instruction */}
            <div className="absolute top-10 right-10 text-[10px] text-slate-500 font-mono opacity-50 pointer-events-none uppercase tracking-tighter">
              Drop {timeMode} image to customize
            </div>

            <div className="max-w-4xl z-10 transition-all duration-1000 transform motion-safe:animate-in fade-in slide-in-from-bottom-10">
              <h2 className="text-sm font-bold tracking-[0.2em] text-purple-400 mb-4 uppercase">
                Episode 01 — {timeMode === 'present' ? 'Today' : 'Legacy'}
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {content.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light mb-12">
                {content.description}
              </p>
            </div>
            
            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-slate-900">
              <div key={imageKey} className="absolute inset-0 transition-opacity duration-1000">
                {customImages[imageKey] ? (
                  <img 
                    src={customImages[imageKey]} 
                    alt={`Scene ${index} ${timeMode}`}
                    className="w-full h-full object-cover opacity-60 animate-in fade-in duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-30">
                    <div className={`absolute inset-0 bg-gradient-to-b ${timeMode === 'present' ? 'from-blue-500/20' : 'from-purple-800/30'} to-slate-900/50 mix-blend-overlay`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/5 text-[10vw] font-black uppercase select-none tracking-[0.3em]">
                        {timeMode}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
          </section>
        );
      })}

      {/* 스크롤 유도 화살표 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
