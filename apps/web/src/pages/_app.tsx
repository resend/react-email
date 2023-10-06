import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Head>
        <link href="/static/favicon.ico" rel="icon" sizes="any" />
        <link href="/static/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/static/apple-touch-icon.png" rel="apple-touch-icon" />
        <meta
          content="https://react.email/static/cover.png"
          name="twitter:image"
        />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="static/cover.png" property="og:image" />
        <meta content="https://react.email" property="og:url" />
        <meta content="website" property="og:type" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
};

export default MyApp;
