// 환경 변수를 가장 먼저 로드하여 Firebase 초기화 시점에 값이 존재하도록 보장
import {config} from "dotenv"
import {resolve} from "path"

config({path: resolve(process.cwd(), ".env")})

import {addNewProduct} from "../src/api/firebase.js"
// import {runBatchUpload} from "../batchUpload.js" // 필요한 경우 참조

/**
 * Gemini 전용 상품 등록 Skill (v1.0)
 * 7단계 시스템을 단순화한 단일 상품 등록 전용 엔진
 */

interface SingleProductInput {
  title: string
  slug: string
  category: string
  softPrompt: string
  hardPrompt: string
  softPrice: number
  hardPrice: number
  collection?: string
  sourceUrl?: string
  imagePath?: string // 로컬 public 폴더 내 이미지 경로
}

async function executeRegistration(input: SingleProductInput) {
  console.log(`🚀 [Gemini Skill] 상품 등록 개시: ${input.title}`)

  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error(
      "❌ 에러: Firebase 환경 변수가 로드되지 않았습니다. .env 파일을 확인해 주소서."
    )
    return
  }

  // 주군과 상군의 지시에 따라 Soft/Hard 프롬프트를 통합한 단일 상품 객체 생성
  const productData = {
    title: input.title,
    slug: input.slug,
    category: input.category,
    prompt: input.softPrompt, // 기본은 Soft로 설정
    price: input.softPrice,
    stage: 1,
    mood: "flow" as const,
    image: input.imagePath || "", // public 경로 (예: /images/products/item.jpg)
    collection: input.collection || "The 1.618 Collection",
    tags: ["Street & Modern", "Soft", "Manual-Entry"],
    sourceUrl: input.sourceUrl || "",
    status: "draft" as const,
    locked: false,
    promptHistory: [
      {
        version: 1,
        prompt: input.hardPrompt,
        testResult: "pending" as const,
        notes: `Hard Version Spec: $${input.hardPrice}`,
        createdAt: new Date().toISOString()
      }
    ],
    currentPromptVersion: 1,
    sampleGallery: [],
    qcNotes: `Claude's Arc Ezel Mission: Soft($${input.softPrice}) / Hard($${input.hardPrice}) 통합 등록`,
    createdAt: new Date().toISOString()
  }

  try {
    // addNewProduct 내부에서 id가 생성되므로 payload 전달
    await addNewProduct(productData, productData.image)
    console.log(
      `✅ [Local Asset Mode] 등록 완료: localhost:3000/shop/${input.slug}`
    )
    console.log(`📸 이미지 경로: ${productData.image}`)
  } catch (err) {
    console.error(`❌ 등록 실패: ${input.title}`, err)
  }
}

// Claude 상군의 긴급 지시 데이터 즉시 실행
executeRegistration({
  title: "Black Lace Sheer Bodysuit",
  slug: "black-lace-sheer-bodysuit",
  category: "Street & Modern",
  softPrompt:
    "She wears black lace bodysuit with cream cardigan overlay, modest styling, natural daylight",
  hardPrompt:
    "She wears black lace sheer bodysuit with strategic cutouts, reclining pose on velvet, dramatic lighting, sultry expression",
  softPrice: 10,
  hardPrice: 30,
  sourceUrl: "https://arc.net/e/1901E6DC-C5B7-4F9F-BD21-0271E75DE8AA",
  imagePath: "/images/products/black-lace-bodysuit-01.jpg" // public/images/products/ 폴더에 이미지 배치 필요
})
