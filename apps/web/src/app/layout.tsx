import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { inter } from "./inter";

export const metadata: Metadata = {
  metadataBase: new URL("https://react.email"),
  icons: {
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
    apple: "/static/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    images: "https://react.email/static/cover.png",
  },
  openGraph: {
    images: "static/cover.png",
    type: "website",
    url: "https://react.email",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans text-slate-12 selection:bg-cyan-5 selection:text-cyan-12 bg-black`}
      >
        {children}

        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
