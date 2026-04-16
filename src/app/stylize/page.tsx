"use client"

import { useState, useRef } from "react"

export default function StylizePage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [sourceBase64, setSourceBase64] = useState<string | null>(null)
  const [sourceMime, setSourceMime] = useState<string>("image/jpeg")
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [resultMime, setResultMime] = useState<string>("image/png")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return
    setResultImage(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setSourceImage(result)
      setSourceBase64(result.split(",")[1])
      setSourceMime(file.type)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleGenerate = async () => {
    if (!sourceBase64) return
    setLoading(true)
    setError(null)
    setResultImage(null)

    try {
      const res = await fetch("/api/stylize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: sourceBase64, mimeType: sourceMime }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResultImage(`data:${data.mimeType};base64,${data.imageBase64}`)
        setResultMime(data.mimeType)
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.")
    }
    setLoading(false)
  }

  const handleDownload = () => {
    if (!resultImage) return
    const a = document.createElement("a")
    a.href = resultImage
    a.download = `stylized-${Date.now()}.${resultMime.split("/")[1] || "png"}`
    a.click()
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0608 0%, #1a0810 50%, #0d0a14 100%)",
        color: "#f0e8e0",
        fontFamily: "'Inter', sans-serif",
        padding: "0 0 60px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid #2a1520",
          background: "rgba(20,8,12,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #8b1a2a, #c94060)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 4px 20px #c9406040",
            }}
          >
            🎨
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>AI Style Transfer</div>
            <div style={{ fontSize: 12, color: "#8a6a6a" }}>어떤 사진이든 페인터리 일러스트로 변환</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Style reference badge */}
        <div
          style={{
            background: "rgba(139,26,42,0.15)",
            border: "1px solid rgba(201,64,96,0.3)",
            borderRadius: 14,
            padding: "14px 18px",
            marginBottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#c94060",
              flexShrink: 0,
              boxShadow: "0 0 8px #c94060",
            }}
          />
          <div style={{ fontSize: 13, color: "#d4a0a0", lineHeight: 1.5 }}>
            <strong style={{ color: "#e8c0c0" }}>적용 스타일:</strong> 수채화·유화 혼합 페인터리 텍스처 · 따뜻한 레드/오렌지 팔레트 · WLOP/Guweiz 스타일 세미리얼 애니 일러스트
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Left: Upload */}
          <div>
            <div style={{ fontSize: 12, color: "#8a6a6a", marginBottom: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              원본 사진
            </div>
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{
                border: `2px dashed ${sourceImage ? "#c9406060" : "#3a2020"}`,
                borderRadius: 16,
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                background: sourceImage ? "transparent" : "rgba(20,10,12,0.5)",
                transition: "border-color 0.2s",
              }}
            >
              {sourceImage ? (
                <img
                  src={sourceImage}
                  alt="원본"
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, borderRadius: 14 }}
                />
              ) : (
                <>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>📷</div>
                  <div style={{ fontSize: 14, color: "#6a4a4a", marginBottom: 4 }}>사진을 클릭하거나 드래그</div>
                  <div style={{ fontSize: 11, color: "#4a3030" }}>JPG, PNG, WEBP 등</div>
                </>
              )}
              {sourceImage && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 11,
                    color: "#e0c0c0",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    fileRef.current?.click()
                  }}
                >
                  변경
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {/* Right: Result */}
          <div>
            <div style={{ fontSize: 12, color: "#8a6a6a", marginBottom: 10, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              변환 결과
            </div>
            <div
              style={{
                border: "2px solid #2a1520",
                borderRadius: 16,
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                background: "rgba(20,10,12,0.5)",
              }}
            >
              {loading ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 16, animation: "spin 2s linear infinite", display: "inline-block" }}>🎨</div>
                  <div style={{ fontSize: 14, color: "#c49090", marginBottom: 6 }}>스타일 변환 중...</div>
                  <div style={{ fontSize: 12, color: "#6a4a4a" }}>Gemini가 그림을 그리고 있어요</div>
                </div>
              ) : resultImage ? (
                <>
                  <img
                    src={resultImage}
                    alt="변환 결과"
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, borderRadius: 14 }}
                  />
                  <button
                    onClick={handleDownload}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background: "linear-gradient(135deg, #8b1a2a, #c94060)",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 14px",
                      fontSize: 12,
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                      boxShadow: "0 2px 12px #c9406060",
                    }}
                  >
                    ↓ 저장
                  </button>
                </>
              ) : error ? (
                <div style={{ textAlign: "center", padding: "0 24px" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                  <div style={{ fontSize: 13, color: "#c06060", lineHeight: 1.6 }}>{error}</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>🖼️</div>
                  <div style={{ fontSize: 13, color: "#4a3030" }}>변환 결과가 여기에 표시됩니다</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <button
            onClick={handleGenerate}
            disabled={!sourceImage || loading}
            style={{
              background:
                !sourceImage || loading
                  ? "#2a1520"
                  : "linear-gradient(135deg, #8b1a2a 0%, #c94060 50%, #e05080 100%)",
              border: "none",
              borderRadius: 14,
              padding: "14px 48px",
              fontSize: 15,
              fontWeight: 700,
              color: !sourceImage || loading ? "#5a3a3a" : "#fff",
              cursor: !sourceImage || loading ? "not-allowed" : "pointer",
              letterSpacing: "-0.2px",
              boxShadow: !sourceImage || loading ? "none" : "0 4px 24px #c9406050",
              transition: "all 0.2s",
            }}
          >
            {loading ? "변환 중..." : "🎨 스타일 변환 시작"}
          </button>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: "#4a3030", marginTop: 16 }}>
          Powered by Google Gemini 2.0 Flash · 변환에 15~30초 소요될 수 있습니다
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
