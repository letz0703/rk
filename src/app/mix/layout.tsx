export default function MixLayout({children}: {children: React.ReactNode}) {
  return (
    <div style={{width: "100vw", maxWidth: "100%", margin: 0, padding: 0}}>
      {children}
    </div>
  )
}
