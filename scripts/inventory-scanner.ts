#!/usr/bin/env tsx

/**
 * Inventory Scanner - 신규 상품 자동 감지
 *
 * 목적:
 * - obsidian/04_Products/ 폴더에서 새 .md 파일 감지
 * - 기존 shopProducts 배열과 비교하여 누락된 상품만 보고
 * - 수동 검토 없이 신규 상품만 식별
 */

import { readdir, readFile } from 'fs/promises'
import { join, extname, basename } from 'path'
import { shopProducts, getAllProducts } from '../src/data/shop-products'

const OBSIDIAN_PRODUCTS_DIR = './obsidian/04_Products'

async function scanObsidianProducts(): Promise<string[]> {
  try {
    const files = await readdir(OBSIDIAN_PRODUCTS_DIR)
    return files
      .filter(file => extname(file) === '.md')
      .map(file => basename(file, '.md'))
  } catch (error) {
    console.log('❌ obsidian 폴더 접근 실패:', error)
    return []
  }
}

async function findNewProducts(): Promise<string[]> {
  const obsidianSlugs = await scanObsidianProducts()
  const staticSlugs = new Set(shopProducts.map(p => p.slug))

  return obsidianSlugs.filter(slug => !staticSlugs.has(slug))
}

async function validateProduct(slug: string): Promise<boolean> {
  try {
    const filePath = join(OBSIDIAN_PRODUCTS_DIR, `${slug}.md`)
    const content = await readFile(filePath, 'utf-8')

    // 기본 필드 검증
    const hasTitle = content.includes('title:')
    const hasCategory = content.includes('category:')
    const hasPrice = content.includes('price:')

    return hasTitle && hasCategory && hasPrice
  } catch (error) {
    console.log(`❌ ${slug} 검증 실패:`, error)
    return false
  }
}

async function showFullInventory() {
  try {
    const allProducts = await getAllProducts()
    const staticCount = shopProducts.length
    const dynamicCount = allProducts.length - staticCount

    console.log(`📊 전체 상품 현황:`)
    console.log(`  - 정적 상품: ${staticCount}개`)
    console.log(`  - 동적 상품: ${dynamicCount}개`)
    console.log(`  - 총 상품: ${allProducts.length}개`)

    if (dynamicCount > 0) {
      console.log('\n📦 동적 상품들:')
      allProducts
        .filter(p => !shopProducts.find(sp => sp.slug === p.slug))
        .forEach(p => console.log(`  - ${p.slug}`))
    }
  } catch (error) {
    console.log('Full inventory check failed:', error)
  }
}

async function main() {
  const isQuiet = process.argv.includes('--quiet')
  const isVerbose = process.argv.includes('--verbose')

  if (!isQuiet) {
    console.log('🔍 Inventory Scanner 시작...\n')
  }

  const newProducts = await findNewProducts()

  if (newProducts.length === 0) {
    if (isVerbose) {
      await showFullInventory()
    } else if (!isQuiet) {
      console.log('✅ 신규 상품 없음.')
    }
    return
  }

  // 신규 상품 발견시에는 quiet 모드에서도 출력
  console.log(`📦 신규 상품 ${newProducts.length}개 발견:`)

  for (const slug of newProducts) {
    const isValid = await validateProduct(slug)
    const status = isValid ? '✅ 유효' : '⚠️  검증 필요'
    console.log(`  - ${slug} ${status}`)
  }

  if (!isQuiet) {
    console.log('\n💡 상태:')
    console.log('✅ 신규 상품들이 /api/shop/products와 개별 페이지에서 자동 로드됨')
    if (isVerbose) {
      console.log('')
      await showFullInventory()
    }
  }
}

main().catch(console.error)