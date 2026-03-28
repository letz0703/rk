"use client"

import {useState, useEffect, useMemo} from "react"

export default function CanMartPage() {
  const [inventory, setInventory] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // 최종 통합 시트의 CSV 게시 URL
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLoBdzCS6ExQO-yICtT4NRKtL0d1g9pqbV0_PNVykWYfpxzBq452bUU19mqQJapbZV_f-8E-rcvtXI/pub?output=csv"

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(CSV_URL)
        const text = await response.text()

        // 데이터 파싱 (CSV 구조에 맞춰 정확히 매핑)
        const rows = text
          .split(/\r?\n/)
          .filter(row => row.trim() !== "")
          .slice(1)
        const parsed = rows
          .map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            return {
              category: cols[1]?.replace(/"/g, "").trim(),
              nameKR: cols[2]?.replace(/"/g, "").trim(),
              nameEN: cols[3]?.replace(/"/g, "").trim(),
              detail: cols[4]?.replace(/"/g, "").trim(),
              price: cols[5]?.replace(/"/g, "").trim()
            }
          })
          .filter(item => item.nameKR)

        setInventory(parsed)
        setIsLoading(false)
      } catch (error) {
        console.error("데이터 로드 실패:", error)
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // 검색 로직: 한글/영문/카테고리 통합 검색
  const filteredResults = useMemo(() => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return []

    return inventory.filter(
      item =>
        item.nameKR.toLowerCase().includes(term) ||
        (item.nameEN && item.nameEN.toLowerCase().includes(term)) ||
        item.category?.toLowerCase().includes(term)
    )
  }, [searchQuery, inventory])

  return (
    <main className="min-h-screen bg-[#131313] text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto pt-20">
        {/* Header */}
        <header className="mb-10 border-b border-[#f2ca50]/30 pb-6">
          <h1 className="text-[#f2ca50] text-4xl font-bold tracking-tight">
            CANMART
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-light">
            Inventory Search System
          </p>
        </header>

        {/* Search Bar: 가독성을 위해 배경을 확실히 어둡게 고정 */}
        <div className="mb-10">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1b1b] border-2 border-[#353534] text-white text-xl p-5 rounded-lg outline-none focus:border-[#f2ca50] transition-all placeholder:text-gray-600"
            placeholder={
              isLoading ? "데이터 불러오는 중..." : "상품명 또는 브랜드 검색"
            }
            autoFocus
          />
        </div>

        {/* Results List: 실용적인 리스트 형태 */}
        <div className="space-y-3">
          {filteredResults.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1c1b1b] p-5 rounded-lg border border-[#353534] flex justify-between items-center shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#f2ca50] text-black text-[10px] px-1.5 py-0.5 font-bold rounded">
                    {item.category}
                  </span>
                  <span className="text-gray-500 text-xs font-mono">
                    {item.nameEN}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {item.nameKR}
                  {item.detail && (
                    <span className="text-gray-400 font-normal ml-2 text-sm">
                      ({item.detail})
                    </span>
                  )}
                </h3>
              </div>
              <div className="text-right ml-4">
                <p className="text-[#f2ca50] text-2xl font-bold">
                  {item.price ? Number(item.price).toLocaleString() : "0"}
                  <span className="text-xs ml-1 text-white/70">원</span>
                </p>
              </div>
            </div>
          ))}

          {searchQuery && filteredResults.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
