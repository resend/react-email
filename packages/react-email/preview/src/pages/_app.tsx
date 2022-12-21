import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from '@next/font/google';
import classnames from 'classnames';
import Head from 'next/head';
import { Tooltip } from '../components/tooltip';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={classnames(inter.variable, 'font-sans')}>
      <Head>
        <title>React Email</title>
      </Head>
      <Tooltip.Provider>
        <Component {...pageProps} />
      </Tooltip.Provider>
    </div>
  );
}

export default MyApp;
