export type Product = {
  name: string
  price: number | null
  image?: string | null // 제품별 이미지 (없으면 브랜드 대표이미지 사용)
}

export type Brand = {
  id: string
  name: string
  category: string
  website: string | null
  image: string
  imageUrl?: string | null
  products: Product[]
}

export const brands: Brand[] = [
  {
    id: "glenfiddich",
    name: "GLENFIDDICH",
    category: "싱글몰트",
    website: "https://www.glenfiddich.com",
    image: "https://img.thewhiskyexchange.com/500/fiddich_12yo.jpg",
    imageUrl: null,
    products: [
      {name: "글랜피딕 12년", price: 62000},
      {name: "글랜피딕 15년", price: 85000},
      {name: "글랜피딕 오렌지", price: 119000},
      {name: "글랜피딕 18년", price: 180000},
      {name: "글랜피딕 21년", price: 280000}
    ]
  },
  {
    id: "macallan",
    name: "MACALLAN",
    category: "싱글몰트",
    website: "https://www.themacallan.com",
    image: "https://img.thewhiskyexchange.com/500/macob.12yo.jpg",
    imageUrl: null,
    products: [
      {name: "맥킬란 12년", price: 112000},
      {name: "맥킬란", price: 120000}
    ]
  },
  {
    id: "balvenie",
    name: "BALVENIE",
    category: "싱글몰트",
    website: "https://www.thebalvenie.com",
    image: "https://img.thewhiskyexchange.com/500/balob.12yov4.jpg",
    imageUrl: null,
    products: [
      {name: "발버니 12년", price: 95000},
      {name: "발버니 14년", price: 150000}
    ]
  },
  {
    id: "bluemamba",
    name: "BLUE MAMBA",
    category: "싱글몰트",
    website: null,
    image: "https://img.thewhiskyexchange.com/500/jwob.bluev2.jpg",
    imageUrl: null,
    products: [{name: "융띠 블루망다", price: 549000}]
  },
  {
    id: "royalsalute",
    name: "ROYAL SALUTE",
    category: "블렌디드",
    website: "https://www.royalsalute.com",
    image: "https://img.thewhiskyexchange.com/500/royob.21yov2.jpg",
    imageUrl: null,
    products: [{name: "로얄살루트 21년", price: 149000}]
  },
  {
    id: "ballantines",
    name: "BALLANTINE'S",
    category: "블렌디드",
    website: "https://www.ballantines.com",
    image: "https://img.thewhiskyexchange.com/500/balob.17yo.jpg",
    imageUrl: null,
    products: [
      {name: "바렌타인 17년", price: 75000},
      {name: "바렌타인 21년", price: 155000},
      {name: "바렌타인 30년", price: 380000}
    ]
  },
  {
    id: "chivas",
    name: "CHIVAS REGAL",
    category: "블렌디드",
    website: "https://www.chivas.com",
    image: "https://img.thewhiskyexchange.com/500/chvob.12yov2.jpg",
    imageUrl: null,
    products: [
      {name: "시바스리갈 12년", price: 50000},
      {name: "시바스리갈 18년", price: 85000}
    ]
  },
  {
    id: "johnniewalker",
    name: "JOHNNIE WALKER",
    category: "블렌디드",
    website: "https://www.johnniewalker.com",
    image: "https://img.thewhiskyexchange.com/500/jwob.blackv4.jpg",
    imageUrl: null,
    products: [
      {name: "존니워커 레드", price: 33000},
      {name: "존니워커 소", price: 45000},
      {name: "존니워커 블랙", price: 50000},
      {name: "존니워커 더블블랙", price: 55000},
      {name: "죠나블루", price: 21000}
    ]
  },
  {
    id: "yamazaki",
    name: "YAMAZAKI",
    category: "일본위스키",
    website: "https://www.suntory.com/whisky/yamazaki",
    image: "https://img.thewhiskyexchange.com/500/yamob.12yo.jpg",
    imageUrl: null,
    products: [{name: "야마자키 12년", price: 270000}]
  },
  {
    id: "suntory",
    name: "SUNTORY",
    category: "일본위스키",
    website: "https://www.suntory.com",
    image: "https://img.thewhiskyexchange.com/500/sunob.kakubin.jpg",
    imageUrl: null,
    products: [{name: "산토리", price: 25000}]
  },
  {
    id: "hennessy",
    name: "HENNESSY",
    category: "코냑",
    website: "https://www.hennessy.com",
    image: "https://img.thewhiskyexchange.com/500/cogob.henvsopp.jpg",
    imageUrl: null,
    products: [{name: "화네시 V.S.O.P", price: 80000}]
  },
  {
    id: "camus",
    name: "CAMUS",
    category: "코냑",
    website: "https://www.camus.fr",
    image: "https://img.thewhiskyexchange.com/500/cogob.camxo.jpg",
    imageUrl: null,
    products: [{name: "카무스 XO", price: 200000}]
  },
  {
    id: "jackdaniels",
    name: "JACK DANIEL'S",
    category: "버번·테네시",
    website: "https://www.jackdaniels.com",
    image: "https://img.thewhiskyexchange.com/500/usa_jac1.jpg",
    imageUrl: null,
    products: [{name: "잭다니엘", price: 50000}]
  },
  {
    id: "apple",
    name: "APPLE",
    category: "버번·테네시",
    website: null,
    image: "https://img.thewhiskyexchange.com/500/usa_jac21.jpg",
    imageUrl: null,
    products: [{name: "애플", price: 50000}]
  },
  {
    id: "tequila",
    name: "TEQUILA",
    category: "기타",
    website: null,
    image: "https://img.thewhiskyexchange.com/500/teqob.patr1.jpg",
    imageUrl: null,
    products: [{name: "데큐라", price: 265000}]
  },
  {
    id: "midleton",
    name: "MIDLETON",
    category: "기타",
    website: "https://www.midletonveryrare.com",
    image: "https://img.thewhiskyexchange.com/500/midob.non11.jpg",
    imageUrl: null,
    products: [{name: "마쿠라이 탱벤", price: 100000}]
  },
  {
    id: "manju",
    name: "MANJU",
    category: "기타",
    website: null,
    image:
      "https://www.sake-central.com/cdn/shop/products/Kubota-Manju-720ml_1024x1024.jpg",
    imageUrl: null,
    products: [
      {name: "만주(쿠포타)", price: 95000},
      {name: "쿠포타만주", price: null}
    ]
  }
]

// 제품(병) 단위 안정 slug. 데이터 정적이라 인덱스 기반으로 충분.
export function productSlug(brandId: string, index: number): string {
  return `${brandId}-${index}`
}

export type ProductHit = {
  brand: Brand
  product: Product
  index: number
}

// slug 로 제품 1개 역참조. 없으면 null.
export function getProductBySlug(slug: string): ProductHit | null {
  for (const brand of brands) {
    for (let index = 0; index < brand.products.length; index++) {
      if (productSlug(brand.id, index) === slug) {
        return {brand, product: brand.products[index], index}
      }
    }
  }
  return null
}
