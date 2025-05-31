import Image from "next/image"

export default function Page() {
  return (
    <div className="profile">
      <Image
        className="dark:invert"
        src="/logo rk.svg"
        alt="rainskiss logo"
        width={200}
        height={200}
        priority
      />
      <h1>Chang Man Kim</h1>
      <p>rainskiss@gmail.com</p>hch




          </div>
  )
}
