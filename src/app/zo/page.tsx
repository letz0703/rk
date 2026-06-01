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
      // Cleanup previous blob URL if exists
      if (uploadedImage && uploadedImage.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImage)
      }

      setUploadedImage(URL.createObjectURL(file))
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.')
      console.error('Image processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [uploadedImage])

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
    </div>
  )
}