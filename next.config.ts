import type {NextConfig} from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.buymeacoffee.com"]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default nextConfig
