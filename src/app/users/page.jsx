"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Users() {
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [name, setName] = useState(""); // 이름 입력 상태
  const [userId, setUserId] = useState(""); // userId 입력 상태
  const [email, setEmail] = useState(""); // 이메일 입력 상태
  const [showForm, setShowForm] = useState(false); // 폼 표시 상태

  const getUsers = async () => {
    try {
      const res = await fetch('/api/users', { method: 'GET' });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users: ", error);
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
      <div className="card-grid">
        {users.map(user => (
          <div className="card" key={user.id}>
            <div className="card-header">{user.name}</div>
            <div className="card-body">
              <div>{user.email}</div>
            </div>
            <div className="card-footer">
              <Link href={`users/${user.userId.toString()}`}>
                <button className="btn">View</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 " style={{marginTop:"2rem"}} >
        <button className="btn" onClick={() => setShowForm(prev => !prev)}>
        {showForm ? "Hide" : "Add a New User"}
      </button> {/* 폼 토글 상태에 따라 버튼 텍스트 변경 */}
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
