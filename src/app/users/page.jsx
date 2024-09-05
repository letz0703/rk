"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Users() {
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [name, setName] = useState(""); // 이름 입력 상태
  const [email, setEmail] = useState(""); // 이메일 입력 상태

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { method: 'GET' }); // GET 요청
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
        method: 'POST', // POST 요청
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      setUsers([...users, data]);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // 컴포넌트 마운트 시 사용자 목록 가져오기
  }, []);

  const handleUserClick = (id) => {
    router.push(`/users/${id}`); // 사용자를 클릭하면 개별 사용자 페이지로 이동
  };

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user.id)} style={{ cursor: 'pointer' }}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>

      <h2>Add a New User</h2>
      <form onSubmit={addUser}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name" // ID 추가
          name="name" // Name 추가
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email" // ID 추가
          name="email" // Name 추가
          required
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}
