export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-slate-12">
        <div>{children}</div>
      </body>
    </html>
  );
}
