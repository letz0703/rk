import { NextResponse } from 'next/server'
import { getAllProducts } from '@/data/shop-products'

/**
 * API 엔드포인트: 전체 상품 목록 (정적 + obsidian)
 * GET /api/shop/products
 */
export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to load products:', error)
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    )
  }
}