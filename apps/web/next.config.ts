import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-email/components', '@react-email/render'],
  async redirects() {
    return [
      {
        source: '/examples',
        destination: '/templates',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: 'https://react-email.mintlify.dev/docs',
      },
      {
        source: '/docs/:match*',
        destination: 'https://react-email.mintlify.dev/docs/:match*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
