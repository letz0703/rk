"use client"

import {useEffect, useState} from "react"

export default function CheckAdminButton() {
  const [isAdmin, setIsAdmin] = useState(false)

  // ✅ 관리자 체크 함수 따로 빼줌
  const checkAdmin = () => {
    const userJson = localStorage.getItem("user")
    if (!userJson) {
      setIsAdmin(false)
      return
    }

    try {
      const user = JSON.parse(userJson)
      const uid = String(user?.uid || "")
      const adminUid = String(process.env.NEXT_PUBLIC_ADMIN_UID || "")

      console.log("유저 uid:", uid)
      console.log("관리자 uid:", adminUid)

      if (uid === adminUid) {
        setIsAdmin(true)
        console.log("✅ 관리자 인증 완료")
      } else {
        setIsAdmin(false)
        console.log("❌ 관리자 아님")
      }
    } catch (e) {
      console.error("user 파싱 실패:", e)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    // 최초 실행
    checkAdmin()

    // ✅ 이벤트 리스너 등록
    window.addEventListener("admin-check", checkAdmin)

    // ✅ cleanup
    return () => {
      window.removeEventListener("admin-check", checkAdmin)
    }
  }, [])

  if (!isAdmin) return null

  return <button>관리자 전용 버튼</button>
}
