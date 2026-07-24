"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Link from "next/link"

interface SaveData {
  originalImage: string
  prompt: string
  userMemo: string
}

export default function ZoPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [userMemo, setUserMemo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 저장된 등록 목록 + 검색
  type ZoResult = {
    id: number
    originalImage: string
    prompt: string
    userMemo: string
    created: string
  }
  const [results, setResults] = useState<ZoResult[]>([])
  const [search, setSearch] = useState("")

  const loadResults = useCallback(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("zo-results") || "[]")
      setResults(Array.isArray(raw) ? raw : [])
    } catch {
      setResults([])
    }
  }, [])

  // 마운트 시 저장분 로드
  useEffect(() => {
    loadResults()
  }, [loadResults])

  const deleteResult = (id: number) => {
    const next = results.filter(r => r.id !== id)
    setResults(next)
    localStorage.setItem("zo-results", JSON.stringify(next))
  }

  // Cleanup blob URL on unmount or when image changes
  useEffect(() => {
    return () => {
      if (uploadedImage && uploadedImage.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImage)
      }
    }
  }, [uploadedImage])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError(null)
    setIsLoading(true)

    try {
      // base64 data URL로 읽음 → localStorage 저장 후 새로고침해도 이미지 유지
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setUploadedImage(dataUrl)
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.')
      console.error('Image processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const handleSave = async () => {
    if (!uploadedImage || !prompt) {
      setError('이미지와 프롬프트를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const saveData = {
        id: Date.now(),
        originalImage: uploadedImage,
        prompt: prompt,
        userMemo: userMemo,
        created: new Date().toISOString()
      }

      // Save to localStorage for now
      const existing = JSON.parse(localStorage.getItem('zo-results') || '[]')
      existing.unshift(saveData)
      localStorage.setItem('zo-results', JSON.stringify(existing))
      loadResults()

      // Show success message briefly
      setError(null)

      // Reset form after short delay for better UX
      setTimeout(() => {
        // Cleanup blob URL before reset
        if (uploadedImage && uploadedImage.startsWith('blob:')) {
          URL.revokeObjectURL(uploadedImage)
        }
        setUploadedImage(null)
        setPrompt("")
        setUserMemo("")
      }, 1000)

      // Temporary success indicator
      const successMsg = '✅ 저장되었습니다!'
      setError(successMsg)
      setTimeout(() => setError(null), 2000)

    } catch (err) {
      setError('저장 중 오류가 발생했습니다.')
      console.error('Save error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (uploadedImage) {
    return (
      <div className="w-full min-h-screen bg-[#0e0e0e] text-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-black tracking-tight text-white">
              RAINSKISS
            </Link>
            <div className="text-white/60 text-sm">
  Prompt Studio
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Original Image */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-4">업로드된 이미지</h2>
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="max-w-md mx-auto rounded-lg"
            />
          </div>

          {/* Prompt Input */}
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">프롬프트</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="이미지 생성용 프롬프트를 입력하세요..."
                className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c10002] resize-vertical"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">메모</h2>
              <textarea
                value={userMemo}
                onChange={(e) => setUserMemo(e.target.value)}
                placeholder="추가 메모, 참고 사항, 아이디어 등을 기록하세요..."
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#c10002] resize-vertical"
              />
            </div>
          </div>

          {/* Error/Success Message */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              error.includes('✅')
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-[#c10002] hover:bg-[#a00001] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {isLoading ? '저장 중...' : '저장하기'}
            </button>
            <button
              onClick={() => {
                // Cleanup blob URL before reset
                if (uploadedImage && uploadedImage.startsWith('blob:')) {
                  URL.revokeObjectURL(uploadedImage)
                }
                setUploadedImage(null)
                setPrompt("")
                setUserMemo("")
                setError(null)
              }}
              disabled={isLoading}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              새로 시작
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#0e0e0e] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tight text-white">
            RAINSKISS
          </Link>
          <div className="text-white/60 text-sm">
Prompt Studio
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Error Message */}
        {error && !error.includes('✅') && (
          <div className="mb-6 p-4 rounded-lg text-center bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors ${
            isLoading
              ? 'border-yellow-500/50 bg-yellow-500/5 cursor-wait'
              : isDragActive
              ? 'border-[#c10002] bg-[#c10002]/10'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <input {...getInputProps()} disabled={isLoading} />
          <div className="space-y-4">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c10002] mx-auto"></div>
                <h2 className="text-xl font-semibold">이미지 처리 중...</h2>
              </>
            ) : (
              <>
                <div className="text-6xl">📸</div>
                <h2 className="text-2xl font-semibold">의상 이미지를 드롭하세요</h2>
                <p className="text-white/60">
                  {isDragActive
                    ? '이미지를 여기에 놓으세요...'
                    : 'JPG, PNG, WEBP 파일을 드래그하거나 클릭하여 선택'}
                </p>
                <p className="text-sm text-white/40">
                  업로드 후 프롬프트와 메모를 작성하여 저장
                </p>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-white/60">
          <p>의상 이미지 업로드 후</p>
          <p>프롬프트와 메모를 작성하여 저장하세요</p>
        </div>
      </div>

      {/* 저장된 등록 목록 + 검색 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">
            내 등록{" "}
            <span className="text-white/40 text-sm">({results.length})</span>
          </h2>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="프롬프트·메모 검색…"
            className="w-64 max-w-[50%] px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#c10002]"
          />
        </div>

        {(() => {
          const q = search.trim().toLowerCase()
          const filtered = q
            ? results.filter(
                r =>
                  r.prompt.toLowerCase().includes(q) ||
                  r.userMemo.toLowerCase().includes(q)
              )
            : results

          if (results.length === 0) {
            return (
              <p className="text-center text-white/40 text-sm py-12">
                아직 등록 없음. 위에서 이미지+프롬프트 저장하면 여기 나옴.
              </p>
            )
          }
          if (filtered.length === 0) {
            return (
              <p className="text-center text-white/40 text-sm py-12">
                &quot;{search}&quot; 검색 결과 없음
              </p>
            )
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(r => (
                <div
                  key={r.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#c10002]/50 transition-colors"
                >
                  {r.originalImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.originalImage}
                      alt="등록 이미지"
                      className="w-full aspect-[3/4] object-cover"
                    />
                  )}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-white/80 whitespace-pre-wrap break-words line-clamp-4 font-mono">
                      {r.prompt}
                    </p>
                    {r.userMemo && (
                      <p className="text-[11px] text-white/50 whitespace-pre-wrap break-words line-clamp-2">
                        📝 {r.userMemo}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => copyToClipboard(r.prompt)}
                        className="text-[11px] font-semibold text-[#c10002] hover:opacity-70 transition"
                      >
                        프롬프트 복사
                      </button>
                      <button
                        onClick={() => deleteResult(r.id)}
                        className="text-[11px] text-white/30 hover:text-red-400 transition"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}