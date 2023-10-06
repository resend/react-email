import { Html, Head, Main, NextScript } from "next/document";

const MyDocument = () => {
  return (
    <Html
      className="text-slate-12 selection:bg-cyan-5 selection:text-cyan-12 bg-black"
      lang="en"
    >
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
