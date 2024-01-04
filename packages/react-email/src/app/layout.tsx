import type { Metadata } from 'next';
import './globals.css';
import { inter } from './inter';

export const metadata: Metadata = {
  title: 'React Email'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
