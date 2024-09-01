import Link from "next/link"
import "./globals.css"

//const inter = Inter({subsets: ["latin"]})

export const metadata = {
  title: "RainsKiss",
  description: "Playground"
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
    <body>
      <nav className="top-nav">
        <div className="nav-text-large">][</div>
        <ul className="nav-list">
          <li>
            <Link href="/posts">Posts</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
          <li>
            <Link href="/todos">Todos</Link>
          </li>
        </ul>
      </nav>
      <div className="container">{children}</div>
    </body>
  </html>
  )
}
