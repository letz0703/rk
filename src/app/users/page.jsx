"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Users() {
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [name, setName] = useState(""); // 이름 입력 상태
  const [userId, setUserId] = useState(""); // userId 입력 상태
  const [email, setEmail] = useState(""); // 이메일 입력 상태
  const [showForm, setShowForm] = useState(false); // 폼 표시 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const getUsers = async () => {
    setIsLoading(true); // 로딩 상태 시작
    setError(null); // 에러 상태 초기화
    try {
      const res = await fetch('/api/users', { method: 'GET' });
      const data = await res.json();
      if (data.length === 0) {
        // 만약 데이터가 없으면 Firestore에서 다시 불러오기 시도
        throw new Error('No users found, fetching from remote...');
      }
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users from local, trying remote...", error);
      // 로컬에서 실패한 경우 재시도 또는 오류 처리
      await fetchFromRemote();
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const fetchFromRemote = async () => {
    try {
      const res = await fetch('/api/remoteUsers', { method: 'GET' });
      const remoteData = await res.json();
      if (remoteData.length > 0) {
        setUsers(remoteData);
      } else {
        throw new Error('No remote data available');
      }
    } catch (remoteError) {
      setError("Failed to fetch users from remote: " + remoteError.message);
      console.error("Error fetching users from remote: ", remoteError);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId, email }),
      });
      const data = await res.json();
      setUsers([...users, data]);
      setName("");
      setUserId("");
      setEmail("");
      setShowForm(false); // 사용자 추가 후 폼 숨기기
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1 className="page-title">Users List</h1>
      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="card-grid">
          {users.length === 0 ? (
            <p>No users found. Please add a user.</p>
          ) : (
            users.map((user) => (
              <div className="card" key={user.id}>
                <div className="card-header">{user.name}</div>
                <div className="card-body">
                  <div>{user.email}</div>
                </div>
                <div className="card-footer">
                  <Link href={`users/${user.userId ? user.userId.toString() : "#"}`}>
                    <button className="btn">View</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <div className="mt-2" style={{ marginTop: "2rem" }}>
        <button className="btn" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Hide" : "Add a New User"}
        </button>
        {/* 폼 토글 상태에 따라 버튼 텍스트 변경 */}
        {showForm && (
          <div>
            <h3>Add a New User</h3>
            <form onSubmit={addUser}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                name="name"
                required
              />
              <input
                type="text"
                placeholder="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                id="userId"
                name="userId"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                required
              />
              <button type="submit">Add User</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
