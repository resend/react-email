import './globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<Readonly<RootLayoutProps>> = ({ children }) => {
  const title = 'React Email';
  const description =
    'High-quality, unstyled components for creating emails using React.';

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta content={title} property="og:title" />
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content="https://react.email" property="og:url" />
      </head>
      <body className="bg-gray-1 text-gray-12 font-sans selection:text-gray-1 selection:bg-cyan-1">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
