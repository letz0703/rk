import fs from "fs"
import path from "path"
import {Readable} from "stream"
import {finished} from "stream/promises"

/**
 * Gemini 이미지 다운로드 Skill (v1.0)
 * 웹 URL의 이미지를 로컬 public 폴더로 저장
 */

async function downloadImage(url: string, fileName: string) {
  const destDir = path.join(process.cwd(), "public/images/products")

  // 폴더가 없으면 생성
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, {recursive: true})
  }

  const destPath = path.join(destDir, fileName)
  console.log(`📡 이미지 다운로드 시도: ${url}`)

  const response = await fetch(url)
  if (!response.ok) throw new Error(`❌ 다운로드 실패: ${response.statusText}`)
  if (!response.body) throw new Error("❌ 응답 본문이 비어 있습니다.")

  const fileStream = fs.createWriteStream(destPath)
  await finished(Readable.fromWeb(response.body as any).pipe(fileStream))

  console.log(`✅ 이미지 저장 완료: public/images/products/${fileName}`)
}

// Black Lace Bodysuit 실제 이미지 다운로드
const targetUrl = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80" // Fashion/bodysuit 이미지
const targetName = "black-lace-bodysuit-01.jpg"

downloadImage(targetUrl, targetName).catch(console.error)
