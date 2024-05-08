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
  }
};
