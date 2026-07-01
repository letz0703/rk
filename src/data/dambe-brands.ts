// /dambe (어머니 가게 담배 가격표) — 정적 시드/폴백.
// 구조는 /ic(주류)와 동일. 타입은 ic-brands에서 재사용.
// FB override 있으면 그게 우선(가격·이미지 편집은 admin만).
import type {Brand, Product} from "@/data/ic-brands"

export type {Brand, Product}

// 가격 = 보루(carton, 10갑) 단위. 가게 가격표(2026.03) 기준.
export const brands: Brand[] = [
  {
    id: "esse",
    name: "ESSE",
    category: "국산",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "프라임", price: 36000},
      {name: "체인지 1미리", price: 37000},
      {name: "체인지 4미리(면세)", price: 38000},
      {name: "체인지 빨강 스트롱", price: 37000},
      {name: "체인지 4미리 수출", price: 28000},
      {name: "히말라야", price: 37000},
      {name: "히말라야 윈터", price: 37000},
      {name: "빙", price: 37000},
      {name: "UP", price: 37000},
      {name: "더블", price: 37000},
      {name: "0.1", price: 37000},
      {name: "0.5", price: 37000},
      {name: "0.1 수출", price: 30000},
      {name: "그램", price: 37000},
      {name: "원", price: 36000},
      {name: "스페셜 골드(은색)", price: 40000},
      {name: "골드 수출", price: 28000},
      {name: "골드 면세", price: 41000},
      {name: "라이트", price: 28000},
      {name: "순", price: 31000},
      {name: "블랙", price: 32000},
      {name: "클래식", price: 37000},
      {name: "프레소", price: 37000},
      {name: "로얄펠리스", price: 65000},
      {name: "수출 검정", price: 28000}
    ]
  },
  {
    id: "this",
    name: "THIS",
    category: "국산",
    website: null,
    image: "",
    imageUrl: null,
    products: [{name: "플러스", price: 37000}]
  },
  {
    id: "theone",
    name: "THE ONE",
    category: "국산",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "오렌지", price: 37000},
      {name: "블루", price: 37000}
    ]
  },
  {
    id: "raison",
    name: "RAISON",
    category: "국산",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "블랙", price: 37000},
      {name: "블루", price: 37000}
    ]
  },
  {
    id: "bohem",
    name: "BOHEM",
    category: "국산",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "시가", price: 37000},
      {name: "슬림", price: 37000},
      {name: "슬림 브라운", price: 37000}
    ]
  },
  {
    id: "simple",
    name: "SIMPLE",
    category: "국산",
    website: null,
    image: "",
    imageUrl: null,
    products: [{name: "심플", price: 37000}]
  },
  {
    id: "marlboro",
    name: "MARLBORO",
    category: "수입",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "레드", price: 40000},
      {name: "골드", price: 40000}
    ]
  },
  {
    id: "mevius",
    name: "MEVIUS",
    category: "수입",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "뫼비우스", price: 40000},
      {name: "윈드(하늘색)", price: 40000}
    ]
  },
  {
    id: "dunhill",
    name: "DUNHILL",
    category: "수입",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "6미리", price: 41000},
      {name: "3미리", price: 41000}
    ]
  },
  {
    id: "virginia",
    name: "VIRGINIA",
    category: "수입",
    website: null,
    image: "",
    imageUrl: null,
    products: [{name: "골드", price: 41000}]
  },
  {
    id: "manchester",
    name: "MANCHESTER",
    category: "수입",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "회색", price: 25000},
      {name: "파랑", price: 25000},
      {name: "빨강", price: 25000},
      {name: "검정", price: 25000}
    ]
  },
  {
    id: "americanlegend",
    name: "AMERICAN LEGEND",
    category: "수입",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "레드", price: 25000},
      {name: "화이트", price: 25000},
      {name: "빨강", price: 25000}
    ]
  },
  {
    id: "sevenstar",
    name: "SEVEN STARS",
    category: "수입",
    website: null,
    image: "",
    imageUrl: null,
    products: [
      {name: "10", price: 52000},
      {name: "차콜", price: 52000}
    ]
  },
  {
    id: "cloud",
    name: "CLOUD",
    category: "전자담배",
    website: null,
    image: "",
    imageUrl: null,
    products: [{name: "클라우드", price: 42000}]
  },
  {
    id: "handmade",
    name: "수제담배",
    category: "기타",
    website: null,
    image: "",
    imageUrl: null,
    products: [{name: "수제담배", price: 13000}]
  }
]

// 제품(갑) 단위 안정 slug. 데이터 정적이라 인덱스 기반으로 충분.
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
