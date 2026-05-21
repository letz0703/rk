export type Prompt = {
  id: string
  title: string
  content: string
  searchText: string
  images?: string[]
  createdAt?: number
  updatedAt?: number
}

export const promptsData: Prompt[] = [
  {
    id: "phi-fashion-basic",
    title: "φ Golden Ratio Fashion Fundamentals",
    content: "Create a fashion portrait using golden ratio (φ=1.618) proportions. Subject wearing elegant clothing with mathematical precision in proportions, golden spiral composition, divine proportion aesthetics, sophisticated lighting that enhances natural beauty through geometric harmony.",
    searchText: "golden ratio phi fashion mathematical proportions divine geometry elegant portrait sophisticated",
    createdAt: 1640995200000, // 2022-01-01
    updatedAt: 1640995200000
  },
  {
    id: "mathematical-elegance",
    title: "Mathematical Elegance - Geometric Fashion",
    content: "High-fashion editorial featuring geometric patterns and mathematical precision. Clean lines, structured silhouettes, architectural fashion elements, modern minimalist aesthetic, sharp focus on fabric geometry, professional studio lighting, mathematical beauty in fashion design.",
    searchText: "geometric fashion mathematical elegance editorial clean lines architectural structured minimalist",
    createdAt: 1641081600000, // 2022-01-02
    updatedAt: 1641081600000
  },
  {
    id: "urban-coastal-phi",
    title: "Urban Coastal φ Collection",
    content: "Coastal urban elegance with φ proportional styling. Cream-colored outfit against modern cityscape, waterfront setting, natural walking pose with mathematical grace, golden ratio composition, sophisticated metropolitan fashion, architectural harmony background.",
    searchText: "coastal urban phi proportional cream cityscape waterfront mathematical grace metropolitan",
    createdAt: 1641168000000, // 2022-01-03
    updatedAt: 1641168000000
  },
  {
    id: "fibonacci-spiral-fashion",
    title: "Fibonacci Spiral Fashion Composition",
    content: "Fashion photography using Fibonacci spiral composition principles. Dynamic pose following mathematical curves, flowing fabric movement, spiral visual flow, golden ratio framing, natural elegance enhanced by geometric positioning, artistic mathematical fashion.",
    searchText: "fibonacci spiral composition mathematical curves flowing fabric golden ratio geometric positioning",
    createdAt: 1641254400000, // 2022-01-04
    updatedAt: 1641254400000
  },
  {
    id: "pi-dynamic-movement",
    title: "π Dynamic Fashion Movement",
    content: "Capture fashion in motion using π (pi) dynamic principles. Circular movement patterns, flowing dress in motion, mathematical precision in movement capture, elegant motion blur effects, synchronized fashion choreography, geometric motion aesthetics.",
    searchText: "pi dynamic movement circular motion flowing dress motion blur choreography geometric motion",
    createdAt: 1641340800000, // 2022-01-05
    updatedAt: 1641340800000
  },
  {
    id: "sacred-geometry-style",
    title: "Sacred Geometry Fashion Styling",
    content: "Fashion portrait incorporating sacred geometry principles. Symmetrical compositions, divine proportion styling, geometric pattern integration, mystical fashion aesthetics, balanced symmetry, spiritual geometry in modern fashion design.",
    searchText: "sacred geometry symmetrical divine proportion geometric patterns mystical fashion spiritual",
    createdAt: 1641427200000, // 2022-01-06
    updatedAt: 1641427200000
  }
]

// Helper function to search prompts
export function searchPrompts(query: string, prompts: Prompt[] = promptsData): Prompt[] {
  if (!query.trim()) {
    return prompts.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
  }

  const searchQuery = query.toLowerCase()
  return prompts
    .filter(prompt =>
      prompt.title.toLowerCase().includes(searchQuery) ||
      prompt.content.toLowerCase().includes(searchQuery) ||
      prompt.searchText.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
}