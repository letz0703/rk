"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "@/components/context/AuthContext";
import { onSunoPlaylist, addSunoTrack, deleteSunoTrack } from "@/api/firebase";

type Track = {
  id: string;
  url: string;
  addedAt: number;
};

function extractSunoId(url: string): string | null {
  // https://suno.com/song/SONG_ID 또는 https://suno.com/s/SONG_ID 형태 지원
  const match = url.match(/suno\.com\/(?:song\/|s\/)([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

export default function SunoPlayer() {
  const { isAdmin } = useAuthContext();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputUrl, setInputUrl] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const unsub = onSunoPlaylist((data: Track[]) => {
      setTracks(data);
    });
    return () => unsub();
  }, []);

  const currentTrack = tracks[currentIndex];
  const songId = currentTrack ? extractSunoId(currentTrack.url) : null;

  const handleAdd = async () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    const id = extractSunoId(trimmed);
    if (!id) {
      alert("올바른 Suno 링크를 붙여넣어 주세요.\n예: https://suno.com/song/...");
      return;
    }
    await addSunoTrack(trimmed);
    setInputUrl("");
  };

  const handleDelete = async (trackId: string) => {
    await deleteSunoTrack(trackId);
    if (currentIndex >= tracks.length - 1) {
      setCurrentIndex(Math.max(0, tracks.length - 2));
    }
  };

  const handleNext = () => {
    if (tracks.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  const handlePrev = () => {
    if (tracks.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  if (tracks.length === 0 && !isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* 플레이어 본체 */}
      {!isMinimized && (
        <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-80">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 bg-white/5">
            <span className="text-white/70 text-xs font-medium">🎵 Suno Player</span>
            <div className="flex gap-2 items-center">
              {tracks.length > 0 && (
                <span className="text-white/40 text-xs">
                  {currentIndex + 1} / {tracks.length}
                </span>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/40 hover:text-white/80 text-lg leading-none"
              >
                −
              </button>
            </div>
          </div>

          {/* iframe 플레이어 */}
          {songId ? (
            <iframe
              ref={iframeRef}
              src={`https://suno.com/embed/${songId}`}
              width="100%"
              height="152"
              allow="autoplay"
              className="border-0"
            />
          ) : (
            <div className="h-24 flex items-center justify-center text-white/30 text-sm">
              {isAdmin ? "아래에서 트랙을 추가해 주세요" : "재생 중인 곡이 없어요"}
            </div>
          )}

          {/* 이전/다음 버튼 */}
          {tracks.length > 1 && (
            <div className="flex justify-center gap-4 py-2 bg-white/5">
              <button
                onClick={handlePrev}
                className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition"
              >
                ◀ 이전
              </button>
              <button
                onClick={handleNext}
                className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition"
              >
                다음 ▶
              </button>
            </div>
          )}

          {/* 관리자 전용: 트랙 목록 + 추가 */}
          {isAdmin && (
            <div className="border-t border-white/10 p-3 flex flex-col gap-2">
              {/* 트랙 목록 */}
              {tracks.length > 0 && (
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {tracks.map((track, i) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between gap-2 px-2 py-1 rounded-lg cursor-pointer text-xs transition ${
                        i === currentIndex
                          ? "bg-white/20 text-white"
                          : "text-white/50 hover:bg-white/10 hover:text-white/80"
                      }`}
                      onClick={() => setCurrentIndex(i)}
                    >
                      <span className="truncate flex-1">
                        {i + 1}. {extractSunoId(track.url) ?? track.url}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(track.id);
                        }}
                        className="text-red-400/60 hover:text-red-400 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* URL 입력 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Suno URL 붙여넣기..."
                  className="flex-1 bg-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none placeholder-white/30 focus:bg-white/15"
                />
                <button
                  onClick={handleAdd}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-2 rounded-lg transition"
                >
                  추가
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 최소화 버튼 */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#1a1a2e] border border-white/10 text-white/70 hover:text-white rounded-full w-12 h-12 flex items-center justify-center shadow-2xl hover:bg-[#2a2a4e] transition"
          title="Suno Player 열기"
        >
          🎵
        </button>
      )}
    </div>
  );
}