"use client"

import dynamic from "next/dynamic"

// AlertAll 컴포넌트를 동적으로 로드
const AlertAll=dynamic(() => import("./AlertAll"), {
	ssr: false, // 클라이언트에서만 렌더링
})

export default function AlertDynamic() {
	return (
		<div>
			<AlertAll />
		</div>
	)
}
