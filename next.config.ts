import type {NextConfig} from "next"
import path from "path"

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
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
