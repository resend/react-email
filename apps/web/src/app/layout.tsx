import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import localFont from 'next/font/local';

const inter = localFont({
  display: 'swap',
  preload: true,
  src: '../../public/fonts/inter/inter.ttf',
  variable: '--font-inter',
  weight: '400 700',
});

const commitMono = localFont({
  display: 'swap',
  preload: true,
  src: [
    {
      path: '../../public/fonts/commit-mono/commit-mono-regular.ttf',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../../public/fonts/commit-mono/commit-mono-italic.ttf',
      style: 'italic',
      weight: '400',
    },
  ],
  variable: '--font-commit-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://react.email'),
  title: {
    default: 'React Email',
    template: '%s • React Email',
  },
  description:
    'A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.',
  authors: {
    name: 'Resend Team',
  },
  icons: {
    apple: '/meta/apple-touch-icon.png',
    icon: [
      {
        sizes: 'any',
        url: '/meta/favicon.ico',
      },
      {
        type: 'image/svg+xml',
        url: '/meta/favicon.svg',
      },
    ],
  },
  openGraph: {
    description:
      'A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.',
    images: [
      {
        url: '/meta/cover.png',
      },
    ],
    locale: 'en_US',
    siteName: 'React Email',
    title: 'React Email',
    type: 'website',
    url: 'https://react.email',
  },
  twitter: {
    card: 'summary_large_image',
    images: 'https://react.email/static/cover.png',
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport = {
  themeColor: '#25AEBA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${inter.variable} ${commitMono.variable} antialiased`}
      lang="en"
      color-scheme="dark"
    >
      <head>
        <script src="/js/web-streams-polyfill.js" />
      </head>
      <body className="h-screen-ios overflow-x-hidden bg-black font-sans text-slate-11 text-sm selection:bg-cyan-5 selection:text-cyan-12">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
