// /ic 제품 상세 설명 "초안 시드".
// key = productSlug(brandId, index)  (예: "glenfiddich-0")
// 상세페이지에서 Firebase 글(article)이 없으면 이 시드를 기본값으로 보여준다.
// 사장님이 사이트에서 "글쓰기/수정" → 저장하면 Firebase 값이 우선(시드는 폴백).
// 즉 초안은 넣어두되, 언제든 사이트에서 직접 고칠 수 있다.

export type IcDescription = {
  title?: string
  body: string // 마크다운
}

export const icDescriptions: Record<string, IcDescription> = {
  // 글랜피딕 12년
  "glenfiddich-0": {
    title: "글랜피딕 12년 — 세계에서 가장 사랑받는 싱글몰트",
    body: `셰리와 버번, 두 오크통에서 12년을 숙성시킨 스페이사이드의 대표 싱글몰트입니다. 전 세계 싱글몰트 판매 1위, "위스키 입문자의 교과서"라 불리는 그 이름 그대로 부담 없이 즐기기 좋습니다.

## 맛과 향

- **향** — 잘 익은 서양배, 은은한 오크, 상큼한 사과
- **맛** — 부드러운 과일 단맛에 몰트의 크리미함이 감돕니다
- **피니시** — 길고 깔끔하게 떨어지는 오크 여운

## 이런 분께

- 위스키를 처음 시작하는 분
- 선물용으로 무난하고 품격 있는 한 병을 찾는 분
- 하이볼·온더락 어떻게 마셔도 실패 없는 데일리 위스키

## 스펙

| 항목 | 내용 |
|------|------|
| 종류 | 싱글몰트 스카치 위스키 |
| 숙성 | 12년 (버번·셰리 캐스크) |
| 도수 | 40% |
| 용량 | 700ml |
| 산지 | 스코틀랜드 스페이사이드 |

---

> **깡통시장 구매대행 · 현장 픽업**
> 가격표에서 **픽업 주문**을 눌러 예약해 주세요. 물건 확보 후 문자로 안내드리며, 매장 방문 시 현장 결제로 픽업하시면 됩니다. (온라인 결제 없음)`
  }
}

// slug 로 초안 설명 조회. 없으면 null.
export function getIcDescription(slug: string): IcDescription | null {
  return icDescriptions[slug] ?? null
}
