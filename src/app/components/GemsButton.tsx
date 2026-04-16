"use client";

import Link from "next/link";
import { useAuthContext } from "@/components/context/AuthContext";

// 사장님 외에 gems 접근을 허용할 UID 목록
// 나중에 여기에 UID 추가하거나 Firebase로 관리 가능
const APPROVED_GEMS_UIDS: string[] = [
  // 예: "abc123uid", "xyz456uid"
];

export default function GemsButton() {
  const { user, isAdmin, isLoading } = useAuthContext();

  if (isLoading) return null;

  const isApproved =
    isAdmin || (!!user && APPROVED_GEMS_UIDS.includes(user.uid));

  if (!isApproved) return null;

  return (
    <Link
      href="/gems"
      className="px-5 py-2 rounded-full text-sm font-medium transition"
      style={{ backgroundColor: "#100002", color: "#fff" }}
    >
      ✦ Gems
    </Link>
  );
}
