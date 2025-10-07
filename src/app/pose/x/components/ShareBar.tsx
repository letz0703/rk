// app/pose/x/components/ShareBar.tsx
"use client"

export default function ShareBar({id}: {id: string}) {
  const href =
    typeof window !== "undefined" ? window.location.href : `/pose/x/${id}`

  const copy = async () => {
    await navigator.clipboard.writeText(href)
    alert("링크 복사 완료")
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <input
        readOnly
        value={href}
        className="w-full rounded border px-3 py-2"
      />
      <button onClick={copy} className="rounded bg-black px-3 py-2 text-white">
        Copy
      </button>
    </div>
  )
}
