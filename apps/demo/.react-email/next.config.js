
const path = require('path');
/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    ...{"NEXT_PUBLIC_EMAILS_DIR_RELATIVE_PATH":"emails","NEXT_PUBLIC_CLI_PACKAGE_LOCATION":"PLACEHOLDER","NEXT_PUBLIC_OS_PATH_SEPARATOR":"/","NEXT_PUBLIC_USER_PROJECT_LOCATION":"PLACEHOLDER","NEXT_PUBLIC_IS_BUILDING":"true"},
    NEXT_PUBLIC_USER_PROJECT_LOCATION: path.resolve(process.cwd(), '../'),
    NEXT_PUBLIC_CLI_PACKAGE_LOCATION: process.cwd(),
  },
  // this is needed so that the code for building emails works properly
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
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    webpackBuildWorker: true
  },
}