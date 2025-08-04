//npm i next-cloudinary
//https://chatgpt.com/c/688d67e7-28bc-8329-aeab-2da1bdba9a3d
//https://drive.google.com/file/d/1UartVpf6hcRaWsotXcQrTXgUid6RkRdX/view?usp=drive_link

"use client"
import {CldImage} from "next-cloudinary"

export async function uploadImage(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  //console.log(
  //  `https://console.cloudinary.com/app/${cloudName}/image/getting-started`
  //)

  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", uploadPreset)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: data
    }
  )

  const result = await res.json()
  return result.secure_url

  //return fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
  //  method: "POST",
  //  body: data
  //}).then(res => res.json().then(data => data.url))

  //return (
  //  //<CldImage
  //  //  src="cld-sample-5" // Use this sample image or upload your own via the Media Explorer
  //  //  width="500" // Transform the image: auto-crop to square aspect_ratio
  //  //  height="500"
  //  //  crop={{
  //  //    type: "auto",
  //  //    source: true
  //  //  }}
  //  ///>
  //)
}
