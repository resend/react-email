/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (
    /** @type {import('webpack').Configuration & { externals: string[] }} */
    config,
    { isServer }
  ) => {
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
  },
  transpilePackages: [
    '@react-email/components',
    '@react-email/render',
    '@react-email/tailwind',
  ],
}
