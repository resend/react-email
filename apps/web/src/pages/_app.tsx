import '../styles/globals.css';
import 'design-system/styles.css';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Head>
        <link rel="icon" href="/static/favicon.ico" sizes="any" />
        <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />
        <meta
          name="twitter:image"
          content="https://react.email/static/cover.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="static/cover.png" />
        <meta property="og:url" content="https://react.email" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
