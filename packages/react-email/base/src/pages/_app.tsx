import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Tooltip } from '../components/tooltip';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Tooltip.Provider>
      <Component {...pageProps} />
    </Tooltip.Provider>
  );
}
