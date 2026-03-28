"use client"

import {useState} from "react"

export default function RequestPage() {
  const [formData, setFormData] = useState({
    email: "",
    modelId: "",
    details: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/request", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      alert("요청이 성공적으로 전달되었습니다!")
      setFormData({email: "", modelId: "", details: ""}) // 폼 초기화
    } else {
      alert("전송 실패. 다시 시도해주세요.")
    }
  }

  return (
    <div className="p-8">
      <h1>데비안트 모델 제작 요청</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="모델 ID (예: Model_01)"
          value={formData.modelId}
          onChange={e => setFormData({...formData, modelId: e.target.value})}
          className="border p-2"
          required
        />
        <textarea
          placeholder="요청 상세 내용"
          value={formData.details}
          onChange={e => setFormData({...formData, details: e.target.value})}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          요청하기
        </button>
      </form>
    </div>
  )
}
