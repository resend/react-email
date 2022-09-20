import React from 'react';
import Head from 'next/head';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import mailIcon from '../public/static/icons/mail.json';

export default function Home() {
  const mailIconRef = React.useRef<LottieRefCurrentProps>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const onFormSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSaving(true);

      const isProd = process.env.NODE_ENV === 'production'
      const base = isProd ? 'https://react.email' : 'http://localhost:3000'

      await fetch(`${base}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_address: e.target.email.value
        }),
      })

      mailIconRef.current.play();
    }
    catch(e) {
      alert('Something went wrong, try again later.');
    }
    finally {
      setIsSaving(false);
    }
  }

  const title = 'React Email';
  const description = 'High-quality, unstyled components for creating emails using React.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={title} property="og:title" />
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content="https://react.email" property="og:url" />
      </Head>
      <div className="flex min-h-screen flex-col justify-center">
        <div className="mx-auto max-w-5xl items-center justify-center">
          <div className="flex flex-col text-center px-4">
            <p className="text-gray-10 text-sm font-medium uppercase mb-4">
              Coming Soon
            </p>
            <h1 className="text-gray-12 text-5xl font-bold mb-6">
              Build and send<br />emails using React
            </h1>
            <p className="text-gray-11 text-lg mb-6">
              High-quality, unstyled components for creating emails.
            </p>
            <form className="flex gap-2 mx-auto" onSubmit={onFormSubmit}>
              <input type="email" name="email" placeholder="you@example.com" className="outline-none bg-gray-3 hover:bg-gray-4 focus:bg-gray-4 w-44 text-sm px-4 h-10 rounded-full focus:ring-1 focus:ring-cyan-1 transition duration-300 ease-in-out caret-cyan-1" required />
              <button className="box-border outline-none self-center relative inline-flex items-center justify-center rounded-full text-center font-semibold transition duration-300 ease-in-out bg-gray-12 text-gray-1 text-sm h-10 px-4 hover:bg-cyan-1 focus:bg-cyan-1" disabled={isSaving}>
                <Lottie
                  lottieRef={mailIconRef}
                  className="mr-1 w-5 h-5"
                  animationData={mailIcon}
                  loop={false}
                  autoplay={false}
                />
                <span className="relative top-px">Notify Me</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
