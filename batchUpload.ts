import fs from "fs/promises"
import path from "path"
import {addNewProduct, getProductByTitle} from "../lib/firebase"

/**
 * batch-upload: Obsidian md 파일을 스캔하여 Firebase 상품으로 일괄 등록
 */

const NOTES_DIR = path.join(process.cwd(), "obsidian/02_Notes")
const PHI = 1.618

interface ProductData {
  title: string
  prompt: string
  stage: number
  price: number
  category: string
  tags: string[]
}

async function parseMarkdownFile(
  filePath: string
): Promise<ProductData | null> {
  const content = await fs.readFile(filePath, "utf-8")
  const fileName = path.parse(filePath).name

  // Improved parsing: Support English/Korean keys, quotes, and category metadata
  const promptMatch = content.match(
    /(?:prompt|프롬프트):\s*["']?(.*?)["']?(?:\r?\n|$)/i
  )
  const stageMatch = content.match(/(?:stage|단계):\s*(\d+)/i)
  const categoryMatch = content.match(/(?:category|카테고리):\s*(.*)/i)

  if (!promptMatch || !promptMatch[1].trim()) return null

  let stage = stageMatch ? parseInt(stageMatch[1], 10) : 1
  // Validating stage range (1-7) as per rainskiss 7-Stage logic
  stage = Math.max(1, Math.min(7, stage))

  // φ(1.618) 기반 가격 책정: 기본 10$ * φ^stage
  const price = Math.round(10 * Math.pow(PHI, stage))

  return {
    title: fileName,
    prompt: promptMatch[1].trim(),
    stage,
    price,
    category: categoryMatch ? categoryMatch[1].trim() : "Mathematical Fashion",
    tags: ["The 1.618 Collection", `Stage-${stage}`, "Automated-Upload"]
  }
}

export async function runBatchUpload() {
  console.log(`\n🚀 [Batch Upload] 시작: ${NOTES_DIR}`)

  try {
    let files: string[] = []
    try {
      files = await fs.readdir(NOTES_DIR)
    } catch (e) {
      console.error(
        `❌ 오류: 디렉토리에 접근할 수 없습니다 (${NOTES_DIR}). 경로를 확인해 주소서.`
      )
      return {total: 0, success: 0, skip: 0, fail: 0}
    }
    const mdFiles = files.filter(f => f.endsWith(".md"))

    let success = 0
    let skip = 0
    let fail = 0

    for (const file of mdFiles) {
      const filePath = path.join(NOTES_DIR, file)
      const data = await parseMarkdownFile(filePath)

      if (!data) {
        console.warn(`⚠️  패스: 프롬프트를 찾을 수 없음 (${file})`)
        fail++
        continue
      }

      // 중복 체크
      const exists = await getProductByTitle(data.title)
      if (exists) {
        console.info(`ℹ️  건너뜀: 이미 등록된 상품 (${data.title})`)
        skip++
        continue
      }

      try {
        await addNewProduct({
          ...data,
          collection: data.tags[0], // "The 1.618 Collection" 태그를 컬렉션명으로 활용
          createdAt: new Date().toISOString()
        })
        console.log(`✅ 등록 완료: ${data.title} ($${data.price})`)
        success++
      } catch (err) {
        console.error(`❌ 등록 실패: ${data.title}`, err)
        fail++
      }
    }

    console.log(
      `\n📊 처리 결과: 총 ${mdFiles.length}개 | 성공 ${success} | 중복 ${skip} | 실패 ${fail}`
    )
    return {total: mdFiles.length, success, skip, fail}
  } catch (error) {
    console.error("🔥 배치 작업 중 치명적 오류 발생:", error)
    throw error
  }
}
