/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true // compile files that are located next to the .react-email directory
  },
};

module.exports = nextConfig;
