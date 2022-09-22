module.exports = {
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/n2pWEjjNnD',
        permanent: true,
      },
    ];
  },
};
