import { Inter } from 'next/font/google';
import Local from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const sfMono = Local({
  src: [
    {
      path: './fonts/SFMono/SFMonoLight.otf',
      weight: '300',
    },
    {
      path: './fonts/SFMono/SFMonoRegular.otf',
      weight: '400',
    },
    {
      path: './fonts/SFMono/SFMonoMedium.otf',
      weight: '500',
    },
    {
      path: './fonts/SFMono/SFMonoSemibold.otf',
      weight: '600',
    },
    {
      path: './fonts/SFMono/SFMonoBold.otf',
      weight: '700',
    },
    {
      path: './fonts/SFMono/SFMonoHeavy.otf',
      weight: '800',
    },
  ],
  variable: '--font-sf-mono',
  display: 'swap',
});
