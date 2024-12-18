const Robots = () => {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://react.email/sitemap.xml',
    host: 'https://react.email',
  };
};

export default Robots;
