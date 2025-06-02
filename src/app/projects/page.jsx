"use client"
export default function Projects() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: "-1"
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{position: "relative", zIndex: "1", color: "white"}}>
        <h1>project 25JUN. H : male Soprano</h1>
        <p>다시 환생한 바로크 시대 여자 소프라노의 이야기</p>
      </div>
    </div>
  )
}
