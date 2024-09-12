"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PostDetail() {
  const router = useRouter();
  const { postId } = router.query; // URL에서 postId 가져오기
  const [post, setPost] = useState(null); // 게시물 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const getPost = async () => {
    if (!postId) return; // postId가 없으면 실행 안함
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'GET' });
      const data = await res.json();
      setPost(data);
    } catch (error) {
      setError("Error fetching post: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, [postId]);

  return (
    <div>
      {isLoading ? (
        <p>Loading post...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : post ? (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </div>
      ) : (
        <p>Post not found.</p>
      )}
    </div>
  );
}
