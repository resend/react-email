/* eslint-disable import/first */
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-slate-12 font-sans">
        <div className={'font-sans'}>{children}</div>
      </body>
    </html>
  );
}
