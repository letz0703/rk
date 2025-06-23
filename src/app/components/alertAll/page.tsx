"use client"
import dynamic from "next/dynamic"

// AlertAll 컴포넌트 동적 로드
const AlertAll = dynamic(() => import("../AlertAll"), {
  ssr: false // 클라이언트에서만 렌더링
})

export default function Page() {
  return (
    <div>
      <h1>This is the alertAll/page.tsx</h1>
      {/* AlertAll 컴포넌트 사용 */}
      <AlertAll />
    </div>
  )
}
