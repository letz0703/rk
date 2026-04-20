"use client";

import Link from "next/link";

export default function GemsButton() {
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
