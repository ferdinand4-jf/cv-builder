/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'backend'],
  },
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig