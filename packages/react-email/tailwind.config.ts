import type { Config } from 'tailwindcss';

const config: Config = {
  content: {
    // needs to be relative because tailwind will find the content
    // by default based on the process's cwd
    relative: true,
    files: [
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
  },
  theme: {
    extend: {
      backgroundImage: {
        gradient:
          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
        gradientHover:
          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.1) -8.75%, rgba(255, 255, 255, 0.057) 83.95%)',
        shine:
          'linear-gradient(45deg, rgba(255,255,255,0) 45%,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 55%,rgba(255,255,255,0) 100%)',
      },
    },
  },
};
export default config;
