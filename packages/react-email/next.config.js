/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('esbuild');
    }

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
      '@react-email/tailwind',
    ],
    externalDir: true,
  },
  transpilePackages: [
    '@react-email/components',
    '@react-email/render',
    '@react-email/tailwind',
  ],
};

module.exports = nextConfig;
