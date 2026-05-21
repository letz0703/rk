#!/usr/bin/env ts-node

/**
 * 자동 이미지 동기화 스크립트
 *
 * 사용법:
 * bun run scripts/sync-shop-images.ts
 *
 * 또는 특정 제품만:
 * bun run scripts/sync-shop-images.ts coastal-elegance-phi
 */

import {readFileSync, writeFileSync} from 'fs'
import {join} from 'path'
import {scanProductImages, getProductPreviewImage, debugAllProductImages} from '../src/utils/image-scanner'

// 현재 shop-products.ts에서 모든 slug 추출
function extractExistingSlugs(): string[] {
  const shopProductsPath = join(process.cwd(), 'src/data/shop-products.ts')
  const content = readFileSync(shopProductsPath, 'utf-8')

  const slugMatches = content.match(/slug:\s*["']([^"']+)["']/g)
  if (!slugMatches) return []

  return slugMatches.map(match => {
    const slugMatch = match.match(/slug:\s*["']([^"']+)["']/)
    return slugMatch ? slugMatch[1] : ''
  }).filter(Boolean)
}

// shop-products.ts 파일의 이미지 경로 업데이트
function updateShopProductsFile(targetSlug?: string, quietMode = false) {
  const shopProductsPath = join(process.cwd(), 'src/data/shop-products.ts')
  let content = readFileSync(shopProductsPath, 'utf-8')

  const existingSlugs = extractExistingSlugs()
  const slugsToUpdate = targetSlug ? [targetSlug] : existingSlugs

  if (!quietMode) {
    console.log(`🔍 업데이트할 제품: ${slugsToUpdate.join(', ')}`)
  }

  let updatedCount = 0
  let foundProducts: string[] = []
  let missingProducts: string[] = []

  for (const slug of slugsToUpdate) {
    const images = scanProductImages(slug)
    const previewImage = getProductPreviewImage(slug)

    if (images.length === 0) {
      missingProducts.push(slug)
      if (!quietMode) {
        console.log(`⚠️  ${slug}: 이미지를 찾을 수 없습니다.`)
      }
      continue
    }

    foundProducts.push(`${slug}(${images.length})`)
    if (!quietMode) {
      console.log(`✅ ${slug}: ${images.length}개 이미지 발견`)
    }

    // previewImage 업데이트
    const previewRegex = new RegExp(
      `(slug:\\s*["']${slug}["'][\\s\\S]*?previewImage:\\s*)["'][^"']*["']`,
      'g'
    )
    content = content.replace(previewRegex, `$1"${previewImage}"`)

    // gallery 배열 업데이트
    const galleryRegex = new RegExp(
      `(slug:\\s*["']${slug}["'][\\s\\S]*?gallery:\\s*)\\[[\\s\\S]*?\\]`,
      'g'
    )

    const galleryArrayString = '[\n      ' +
      images.map(img => `"${img}"`).join(',\n      ') +
      '\n    ]'

    content = content.replace(galleryRegex, `$1${galleryArrayString}`)

    updatedCount++
  }

  if (updatedCount > 0) {
    // 자동 생성 주석 추가
    const timestamp = new Date().toISOString()
    const header = `// 🤖 자동 생성됨: ${timestamp}\n// 이미지 스캐너로 업데이트된 제품: ${updatedCount}개\n\n`

    if (!content.includes('🤖 자동 생성됨')) {
      content = header + content
    } else {
      // 기존 자동 생성 헤더 교체
      content = content.replace(
        /\/\/ 🤖 자동 생성됨:[\s\S]*?\n\n/,
        header
      )
    }

    writeFileSync(shopProductsPath, content)

    if (quietMode) {
      console.log(`📸 Shop images synced: ${foundProducts.join(', ')}`)
    } else {
      console.log(`\n🎉 ${updatedCount}개 제품의 이미지 경로가 업데이트되었습니다!`)
      console.log(`📄 파일: ${shopProductsPath}`)
    }
  } else {
    if (quietMode) {
      console.log(`📸 Shop images: ${foundProducts.length > 0 ? foundProducts.join(', ') : 'all up to date'}`)
    } else {
      console.log('⚠️  업데이트된 제품이 없습니다.')
    }
  }
}

// 메인 실행
function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  // 개발 모드에서는 간단한 출력
  const quietMode = process.env.NODE_ENV === 'development' || args.includes('--quiet')

  if (command === 'debug') {
    const slugs = extractExistingSlugs()
    debugAllProductImages(slugs)
    return
  }

  if (command === 'scan' && args[1]) {
    // 특정 제품 스캔
    const slug = args[1]
    const images = scanProductImages(slug)
    console.log(`\n${slug} 이미지:`)
    images.forEach((img, i) => console.log(`  ${i + 1}. ${img}`))
    return
  }

  if (command && command !== 'all' && command !== '--quiet') {
    // 특정 제품 업데이트
    updateShopProductsFile(command, quietMode)
  } else {
    // 모든 제품 업데이트
    updateShopProductsFile(undefined, quietMode)
  }
}

main()