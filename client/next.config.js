/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [
     '@react-email/components',
     '@react-email/render',
     '@react-email/tailwind'
    ],
    externalDir: true // compile files that are located next to the .react-email directory
  },
};

module.exports = nextConfig;
