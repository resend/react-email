/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true, // compile files that are located next to the .react-email directory
    serverComponentsExternalPackages: [
      "@react-email/button",
      "@react-email/column",
      "@react-email/container",
      "@react-email/font",
      "@react-email/head",
      "@react-email/heading",
      "@react-email/hr",
      "@react-email/html",
      "@react-email/img",
      "@react-email/link",
      "@react-email/preview",
      "@react-email/render",
      "@react-email/row",
      "@react-email/components",
      "@react-email/section",
      "@react-email/tailwind",
      "@react-email/text",
    ]
  },
};

module.exports = nextConfig;
