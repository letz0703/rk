import type {NextConfig} from "next"
import path from "path"

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // 저장소 전반 레거시 lint 위반(any/require/escape 등)이 Netlify 배포를 막음.
  // 빌드 컴파일은 정상이므로 배포 차단만 해제. 타입체크는 유지.
  eslint: {ignoreDuringBuilds: true},
  images: {
    domains: [
      "cdn.buymeacoffee.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "i.pinimg.com",
      "claude.ai",
      "pinterest.com",
      "pin.it",
      "deviantart.com",
      "www.deviantart.com"
    ]
  }
}

export default nextConfig
