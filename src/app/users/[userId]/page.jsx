"use client";

import { useEffect, useState } from "react";

export default function UserPage({ params }) {
  const { userId } = params; // params 객체에서 userId를 가져옵니다.
  const [user, setUser] = useState(null);

  console.log("userId from params:", userId); // userId 확인



  useEffect(() => {
    if (!userId) return; // userId가 없으면 실행하지 않습니다.

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?id=${userId}`);
        const data = await res.json();
        console.log("Fetched user data:", data); // API 응답 데이터 확인

        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]); // 배열의 첫 번째 요소를 user로 설정
        } else {
          setUser(null); // 데이터가 없을 경우 null로 설정
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <p>Loading...</p>; // user 데이터가 없을 때 로딩 상태 표시

  // user 객체가 정의된 경우 렌더링
  return (
    <div>
      <h1>{user.name}</h1>
      <p>phone: {user.userId}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
