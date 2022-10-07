const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8181/api/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig
