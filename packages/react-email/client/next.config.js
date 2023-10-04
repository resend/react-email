/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: [{ key: 'Cache-Control', value: 'no-store' }],
    },
  ],
  output: 'standalone',
};

module.exports = nextConfig;
