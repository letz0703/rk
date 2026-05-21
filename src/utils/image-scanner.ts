import {readdirSync, existsSync} from 'fs'
import {join} from 'path'

// 지원하는 이미지 형식
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

/**
 * 제품 slug 기반으로 자동으로 이미지를 스캔하여 경로 배열 반환
 */
export function scanProductImages(slug: string): string[] {
  const shopDir = join(process.cwd(), 'public', 'shop')

  if (!existsSync(shopDir)) {
    console.warn(`Shop directory not found: ${shopDir}`)
    return []
  }

  const imageSet = new Set<string>() // 중복 제거를 위한 Set 사용

  try {
    // 1. 직접 파일 스캔 (정확한 slug 매치 + 숫자 패턴만)
    const files = readdirSync(shopDir)
    const directFiles = files
      .filter(file => {
        const isImage = IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
        // 더 엄격한 매칭: slug-숫자.확장자 또는 slug_숫자.확장자 패턴만
        const strictPattern = new RegExp(`^${slug.toLowerCase()}[-_]?\\d*\\.(${IMAGE_EXTENSIONS.join('|').replace(/\./g, '')})$`, 'i')
        return isImage && strictPattern.test(file)
      })
      .sort() // 알파벳순 정렬로 일관성 유지

    directFiles.forEach(file => {
      imageSet.add(`/shop/${file}`)
    })

    // 2. 하위 디렉토리 스캔 (정확한 slug 이름의 폴더만)
    const slugDir = join(shopDir, slug)
    if (existsSync(slugDir)) {
      const subFiles = readdirSync(slugDir)
        .filter(file => IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext)))
        .sort()

      subFiles.forEach(file => {
        imageSet.add(`/shop/${slug}/${file}`)
      })
    }

  } catch (error) {
    console.error(`Error scanning images for ${slug}:`, error)
  }

  // Set을 배열로 변환하고 정렬하여 일관된 순서 보장
  return Array.from(imageSet).sort()
}

/**
 * 제품 slug의 대표 이미지를 자동으로 찾기
 */
export function getProductPreviewImage(slug: string): string {
  const images = scanProductImages(slug)

  if (images.length === 0) {
    return '/shop/placeholder.jpg' // fallback 이미지
  }

  // 우선순위: -01, -main, -preview, 첫 번째 이미지
  const priorityPatterns = ['-01', '-main', '-preview']

  for (const pattern of priorityPatterns) {
    const priorityImage = images.find(img =>
      img.toLowerCase().includes(pattern.toLowerCase())
    )
    if (priorityImage) {
      return priorityImage
    }
  }

  return images[0] // 첫 번째 이미지를 기본값으로
}

/**
 * shop-products.ts 업데이트용 헬퍼 함수
 */
export function generateProductImageConfig(slug: string) {
  const gallery = scanProductImages(slug)
  const previewImage = getProductPreviewImage(slug)

  return {
    previewImage,
    gallery,
    scannedCount: gallery.length,
    lastScanned: new Date().toISOString()
  }
}

// 개발용: 모든 제품의 이미지 현황 출력
export function debugAllProductImages(slugs: string[]) {
  console.log('=== 제품 이미지 스캔 결과 ===')

  for (const slug of slugs) {
    const config = generateProductImageConfig(slug)
    console.log(`\n${slug}:`)
    console.log(`  Preview: ${config.previewImage}`)
    console.log(`  Gallery (${config.scannedCount}개):`)
    config.gallery.forEach((img, i) => {
      console.log(`    ${i + 1}. ${img}`)
    })
  }
}