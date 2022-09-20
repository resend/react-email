import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    const GA_TRACKING_ID = 'UA-241872858-1';

    return (
      <Html className="bg-gray-1 text-gray-12 font-sans">
        <Head>
          <link rel="icon" type="image/x-icon" href="/static/images/favicon.ico" />
          <link rel="icon" type="image/svg+xml" href="/static/images/favicon.svg" sizes="any" />
          
          <meta charSet="utf-8" />
          <meta property="og:type" content="website" />
          <meta content="https://react.email/static/images/og.png" property="og:image" />
          <meta content="summary_large_image" name="twitter:card" />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
