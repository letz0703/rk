"use client"

import React from "react"

export default function GoogleDriveVideoPlayer() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <div className="aspect-video">
        <iframe
          src="https://drive.google.com/file/d/1WoI11SOGktxU3Gl9DQ1Z1DcoUpqGFDkc/preview"
          width="100%"
          height="100%"
          allow="autoplay"
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  )
}
