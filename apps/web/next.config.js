module.exports = {
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['design-system'],
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.com/invite/n2pWEjjNnD',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: 'https://react-email.mintlify.com/docs'
      },
      {
        source: '/docs/:match*',
        destination: 'https://react-email.mintlify.com/docs/:match*'
      }
    ]
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
