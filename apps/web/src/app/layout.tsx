import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { inter } from "./inter";

export const metadata: Metadata = {
  metadataBase: new URL("https://react.email"),
  title: {
    default: "React Email",
    template: "%s • React Email",
  },
  description:
    "A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.",
  authors: {
    name: "Resend Team",
  },
  icons: {
    apple: "/static/apple-touch-icon.png",
    icon: [
      {
        sizes: "any",
        url: "/static/favicon.ico",
      },
      {
        type: "image/svg+xml",
        url: "/static/favicon.svg",
      },
    ],
  },
  openGraph: {
    description:
      "A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.",
    images: [
      {
        url: "static/cover.png",
      },
    ],
    locale: "en_US",
    siteName: "React Email",
    title: "React Email",
    type: "website",
    url: "https://react.email",
  },
  twitter: {
    card: "summary_large_image",
    images: "https://react.email/static/cover.png",
  },
  alternates: {
    canonical: "/",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} relative bg-black font-sans text-slate-12 selection:bg-cyan-5 selection:text-cyan-12`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
