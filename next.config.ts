import type {NextConfig} from "next"
import path from "path"

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: ["cdn.buymeacoffee.com", "res.cloudinary.com", "lh3.googleusercontent.com"]
  }
}

export default nextConfig
