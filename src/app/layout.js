import "./globals.css"

//const inter = Inter({subsets: ["latin"]})

export const metadata = {
  title: "RainsKiss",
  description: "Playground"
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      {/*<body className={inter.className}>*/}
      <body>
        <div >
          {/*<Navbar />*/}
          {children}
          {/*<Footer />*/}
        </div>
      </body>
    </html>
  )
}
