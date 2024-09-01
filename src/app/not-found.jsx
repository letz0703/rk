import Link from "next/link"

const NotFound=() => {
  return (
    <div>
      <h2>NotFound</h2>
      <p>No Such Page</p>
      <Link href="/">Back to Home</Link>
    </div>
  )
}
export default NotFound
