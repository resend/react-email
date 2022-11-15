module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/vercel-invite-user',
        permanent: false,
      },
    ];
  },
};
