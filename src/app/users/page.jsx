"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore"; // Firestore 모듈 가져오기
import { initializeApp } from "firebase/app"; // Firebase 앱 초기화 모듈 가져오기

const firebaseConfig = {
  apiKey: "AIzaSyBWcvOL2ZnZCifdn806iYhqABOm9WNzDNc",
  authDomain: "business-card-maker-21fc7.firebaseapp.com",
  databaseURL: "https://business-card-maker-21fc7-default-rtdb.firebaseio.com",
  projectId: "business-card-maker-21fc7",
  storageBucket: "business-card-maker-21fc7.appspot.com",
  messagingSenderId: "913399558691",
  appId: "1:913399558691:web:930b702df09fc87b8a7796",
  measurementId: "G-VLYX0Y9ZMB"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const fireStore = getFirestore(app);

export default function Home() {
  const [users, setUsers] = useState([]); // 데이터를 저장할 상태 변수
  const [name, setName] = useState(""); // 입력 폼의 이름 상태 변수
  const [email, setEmail] = useState(""); // 입력 폼의 이메일 상태 변수

  const getUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireStore, "users"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setUsers(data); // 데이터를 상태 변수에 저장
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    try {
      await addDoc(collection(fireStore, "users"), { name, email });
      setName(""); // 입력 후 입력 필드 초기화
      setEmail(""); // 입력 후 입력 필드 초기화
      getUsers(); // 새로운 데이터를 포함하도록 사용자 목록을 갱신
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
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
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}
