"use client";

import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]); // 게시물 목록 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 서버에서 게시물을 가져오기
  const getPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 리모트 데이터 가져오기
      console.log("Fetching posts from remote...");
      const res = await fetch("/api/posts", { method: "GET" });
      const data = await res.json();

      // 받아온 데이터를 콘솔에 출력
      console.log("Fetched posts: ", data);

      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);  // 상태에 설정
      } else {
        setError("No remote posts found.");
      }
    } catch (error) {
      setError("Error fetching posts: " + error.message);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <h1 className="page-title">Posts List</h1>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="card-grid">
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            posts.map((post) => (
              <div className="card" key={post.id}>
                <div className="card-header">{post.title}</div>
                <div className="card-body">
                  <p>{post.body.slice(0, 100)}...</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
