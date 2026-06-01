"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import Link from "next/link"
import {addNewProduct} from "@/api/firebase"

type PromptResult = {
  flowSoft: string
  grokHard: string
  koreanKeywords: string
  jsonFormat: string
}

type ProductForm = {
  title: string
  category: string
  price: string
  daUrl: string
  description: string
}

export default function UploadPageContent() {
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<PromptResult>({
    flowSoft: "A stunning Korean woman wearing a black bodysuit with white accents, professional photography, soft natural lighting, elegant pose, high fashion styling, clean studio background, detailed fabric textures",
    grokHard: "Beautiful Korean woman in sleek black-white bodysuit, hourglass proportions, confident stance, dynamic pose, cinematic lighting, sultry expression, artistic composition, premium fashion photography, detailed clothing design",
    koreanKeywords: "She is wearing a black bodysuit with white trim details, form-fitting silhouette, modern design elements, elegant styling",
    jsonFormat: JSON.stringify({
      subject: "korean woman",
      clothing: "black bodysuit with white accents",
      style: "modern fashion",
      lighting: "professional studio",
      pose: "confident elegant",
      quality: "premium photography"
    }, null, 2)
  })
  const [productForm, setProductForm] = useState<ProductForm>({
    title: "Black-White-Bodysuit",
    category: "Street",
    price: "$15",
    daUrl: "https://deviantart.com/rainskiss-x",
    description: "Professional-grade prompts for Grok & Flow. Each prompt is tested and verified for consistent results."
  })
  const [submitting, setSubmitting] = useState(false)


  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const productData = {
        title: productForm.title.trim(),
        description: productForm.description.trim(),
        category: productForm.category,
        price: productForm.price.trim(),
        link: productForm.daUrl.trim(),
        flowSoft: analysisResult.flowSoft,
        grokHard: analysisResult.grokHard,
        koreanKeywords: analysisResult.koreanKeywords,
        jsonFormat: analysisResult.jsonFormat
      }

      await addNewProduct(productData, "")

      alert("상품 등록 완료! ✅")
      router.push("/shop")
    } catch (error) {
      console.error("Submit error:", error)
      alert("등록 실패: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setProductForm({
      title: "Black-White-Bodysuit",
      category: "Street",
      price: "$15",
      daUrl: "https://deviantart.com/rainskiss-x",
      description: "Professional-grade prompts for Grok & Flow. Each prompt is tested and verified for consistent results."
    })
  }

  const categories = [
    "Street",
    "Uniform",
    "Swimwear",
    "Bodysuit",
    "Spring",
    "Summer",
    "Fall",
    "Winter",
    "Shoes",
    "Socks",
    "Background",
    "Accessories"
  ]

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/shop"
            className="text-sm text-white/50 hover:text-white/80 transition mb-4 inline-block"
          >
            ← Back to Shop
          </Link>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Quick Product <span style={{color: "#c10002"}}>Upload</span>
          </h1>
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Drop an image to auto-generate Flow/Grok prompts
          </p>
        </div>

        {/* Simple notice */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-8 text-center">
          <p className="text-blue-300">기본 프롬프트가 로드되어 있습니다. 수정 후 저장하세요.</p>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-white">Generated Prompts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flow Soft */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Flow (Soft) - Public</h3>
                <textarea
                  value={analysisResult.flowSoft}
                  onChange={(e) => setAnalysisResult(prev => prev ? {...prev, flowSoft: e.target.value} : null)}
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-3 text-white text-sm resize-none"
                  placeholder="Flow prompt..."
                />
              </div>

              {/* Grok Hard */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Grok (Hard) - Link Only</h3>
                <textarea
                  value={analysisResult.grokHard}
                  onChange={(e) => setAnalysisResult(prev => prev ? {...prev, grokHard: e.target.value} : null)}
                  className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-3 text-white text-sm resize-none"
                  placeholder="Grok prompt..."
                />
              </div>
            </div>

            {/* Korean Keywords */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Korean Keywords</h3>
              <textarea
                value={analysisResult.koreanKeywords}
                onChange={(e) => setAnalysisResult(prev => prev ? {...prev, koreanKeywords: e.target.value} : null)}
                className="w-full h-24 bg-white/5 border border-white/20 rounded-lg p-3 text-white text-sm resize-none"
                placeholder="She is wearing..."
              />
            </div>

            {/* JSON Format */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">JSON Format</h3>
              <textarea
                value={analysisResult.jsonFormat}
                onChange={(e) => setAnalysisResult(prev => prev ? {...prev, jsonFormat: e.target.value} : null)}
                className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-3 text-white text-sm font-mono resize-none"
                placeholder="JSON data..."
              />
            </div>
          </div>
        )}

        {/* Product Information Form */}
        {analysisResult && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-white">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Product Title</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm(prev => ({...prev, title: e.target.value}))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="e.g. White Halter Mini Dress"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Price</label>
                <input
                  type="text"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({...prev, price: e.target.value}))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="e.g. $15"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">DeviantArt Link</label>
                <input
                  type="url"
                  value={productForm.daUrl}
                  onChange={(e) => setProductForm(prev => ({...prev, daUrl: e.target.value}))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="https://deviantart.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({...prev, description: e.target.value}))}
                className="w-full h-24 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-xl transition"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !productForm.title.trim() || !productForm.price.trim()}
            className="px-8 py-4 bg-[#c10002] hover:bg-[#a10002] disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                등록 중...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}