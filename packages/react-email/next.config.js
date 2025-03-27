/** @type {import('next').NextConfig} */
module.exports = {
  // this is needed so that the code for building emails works properly
  webpack: (
    /** @type {import('webpack').Configuration & { externals: string[] }} */
    config,
    { isServer },
  ) => {
    if (isServer) {
      config.externals.push('esbuild');
    }

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Noticed an issue with typescript transpilation when going from Next 14.1.1 to 14.1.2
  // and I narrowed that down into this PR https://github.com/vercel/next.js/pull/62005
  //
  // What is probably happening is that it's noticing the files for the app are somewhere inside of a `node_modules` and automatically opt-outs of SWC's transpilation.
  //
  // TODO: Open an issue on Nextjs about this.
  transpilePackages: ['react-email'],
};
