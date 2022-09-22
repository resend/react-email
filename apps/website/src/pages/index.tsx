import React from 'react';
import Head from 'next/head';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import mailIcon from '../helpers/mail-icon.json';

export default function Home() {
  const mailIconRef = React.useRef<LottieRefCurrentProps>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [submitLabel, setSubmitLabel] = React.useState('Notify me');
  const [email, setEmail] = React.useState('');

  const onFormSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSaving(true);
      setSubmitLabel('Done!');

      mailIconRef?.current?.play();

      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_address: email,
        }),
      });
    } catch (e) {
      alert('Something went wrong, try again later.');
    } finally {
      setEmail('');
      setIsSaving(false);
    }
  };

  const title = 'React Email';
  const description =
    'High-quality, unstyled components for creating emails using React.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={title} property="og:title" />
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content="https://react.email" property="og:url" />
      </Head>
      <div>
        <div className="absolute w-full">
          <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between mt-6 mb-4">
            <a href="/">
              <svg
                width="24"
                height="24"
                viewBox="0 0 107 106"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M101.25 101.083C105.659 96.6745 106.49 90.7112 106.003 85.5605C105.511 80.344 103.595 74.6796 100.875 69.0295C98.4229 63.9377 95.1545 58.522 91.1988 53C95.1545 47.478 98.4229 42.0623 100.875 36.9705C103.595 31.3204 105.511 25.656 106.003 20.4395C106.49 15.2888 105.659 9.32548 101.25 4.91674C96.841 0.507999 90.8777 -0.323118 85.727 0.163082C80.5106 0.65549 74.8462 2.57153 69.196 5.29199C64.1042 7.74358 58.6885 11.012 53.1665 14.9677C47.6445 11.012 42.2288 7.74358 37.137 5.29199C31.4869 2.57153 25.8225 0.655494 20.606 0.163081C15.4553 -0.323121 9.492 0.507999 5.08326 4.91674C0.674519 9.32548 -0.156601 15.2888 0.329602 20.4395C0.822012 25.656 2.73805 31.3204 5.45851 36.9705C7.9101 42.0623 11.1786 47.478 15.1342 53C11.1786 58.522 7.9101 63.9377 5.45851 69.0295C2.73805 74.6796 0.822012 80.344 0.329602 85.5605C-0.156601 90.7112 0.674519 96.6745 5.08326 101.083C9.492 105.492 15.4553 106.323 20.606 105.837C25.8225 105.345 31.4869 103.428 37.137 100.708C42.2288 98.2564 47.6445 94.988 53.1665 91.0323C58.6885 94.988 64.1042 98.2564 69.196 100.708C74.8462 103.428 80.5106 105.345 85.727 105.837C90.8777 106.323 96.841 105.492 101.25 101.083ZM53.1665 81.0388C58.0927 77.1877 63.1029 72.7621 68.0158 67.8492C72.9287 62.9363 77.3543 57.9262 81.2053 53C77.3543 48.0738 72.9287 43.0637 68.0158 38.1508C63.1029 33.2379 58.0927 28.8123 53.1665 24.9612C48.2403 28.8123 43.2302 33.2379 38.3173 38.1508C33.4044 43.0637 28.9788 48.0738 25.1277 53C28.9788 57.9262 33.4044 62.9363 38.3173 67.8492C43.2302 72.7621 48.2403 77.1877 53.1665 81.0388ZM59.8486 85.949C64.4852 82.2163 69.135 78.0437 73.6726 73.5061C78.2102 68.9685 82.3828 64.3187 86.1155 59.6821C97.0729 75.6209 101.289 89.7305 95.5929 95.4264C89.897 101.122 75.7874 96.9064 59.8486 85.949ZM20.2175 59.6821C23.9503 64.3187 28.1228 68.9685 32.6604 73.5061C37.198 78.0437 41.8478 82.2163 46.4844 85.949C30.5457 96.9064 16.436 101.122 10.7401 95.4264C5.04422 89.7305 9.26014 75.6209 20.2175 59.6821ZM20.2175 46.3179C23.9503 41.6813 28.1228 37.0315 32.6604 32.4939C37.198 27.9563 41.8478 23.7837 46.4844 20.051C30.5457 9.09362 16.436 4.8777 10.7401 10.5736C5.04422 16.2695 9.26014 30.3792 20.2175 46.3179ZM59.8486 20.051C64.4852 23.7837 69.135 27.9563 73.6726 32.4939C78.2102 37.0315 82.3828 41.6813 86.1155 46.3179C97.0729 30.3791 101.289 16.2695 95.5929 10.5736C89.897 4.87769 75.7874 9.09362 59.8486 20.051Z"
                  fill="#F2F2F1"
                />
              </svg>
            </a>
            <div className="flex">
              <a
                href="https://github.com/zenorocha/react-email"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-current transition duration-300 ease-in-out hover:opacity-60"
              >
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="3 3 18 18"
                >
                  <title>GitHub</title>
                  <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"></path>
                </svg>
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="/discord"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-current transition duration-300 ease-in-out hover:opacity-60"
              >
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 5 30.67 23.25"
                >
                  <title>Discord</title>
                  <path d="M26.0015 6.9529C24.0021 6.03845 21.8787 5.37198 19.6623 5C19.3833 5.48048 19.0733 6.13144 18.8563 6.64292C16.4989 6.30193 14.1585 6.30193 11.8336 6.64292C11.6166 6.13144 11.2911 5.48048 11.0276 5C8.79575 5.37198 6.67235 6.03845 4.6869 6.9529C0.672601 12.8736 -0.41235 18.6548 0.130124 24.3585C2.79599 26.2959 5.36889 27.4739 7.89682 28.2489C8.51679 27.4119 9.07477 26.5129 9.55525 25.5675C8.64079 25.2265 7.77283 24.808 6.93587 24.312C7.15286 24.1571 7.36986 23.9866 7.57135 23.8161C12.6241 26.1255 18.0969 26.1255 23.0876 23.8161C23.3046 23.9866 23.5061 24.1571 23.7231 24.312C22.8861 24.808 22.0182 25.2265 21.1037 25.5675C21.5842 26.5129 22.1422 27.4119 22.7621 28.2489C25.2885 27.4739 27.8769 26.2959 30.5288 24.3585C31.1952 17.7559 29.4733 12.0212 26.0015 6.9529ZM10.2527 20.8402C8.73376 20.8402 7.49382 19.4608 7.49382 17.7714C7.49382 16.082 8.70276 14.7025 10.2527 14.7025C11.7871 14.7025 13.0425 16.082 13.0115 17.7714C13.0115 19.4608 11.7871 20.8402 10.2527 20.8402ZM20.4373 20.8402C18.9183 20.8402 17.6768 19.4608 17.6768 17.7714C17.6768 16.082 18.8873 14.7025 20.4373 14.7025C21.9717 14.7025 23.2271 16.082 23.1961 17.7714C23.1961 19.4608 21.9872 20.8402 20.4373 20.8402Z"></path>
                </svg>
                <span className="sr-only">Discord</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
      <div className="flex min-h-screen flex-col justify-center">
        <div className="mx-auto max-w-5xl items-center justify-center">
          <div className="flex flex-col text-center px-4">
            <p className="text-gray-10 text-sm font-medium uppercase mb-4">
              Coming Soon
            </p>
            <h1 className="text-gray-12 text-5xl font-bold mb-6">
              Build and send
              <br />
              emails using React
            </h1>
            <p className="text-gray-11 text-lg mb-6">
              High-quality, unstyled components for creating emails.
            </p>
            <form className="flex gap-2 mx-auto" onSubmit={onFormSubmit}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="outline-none bg-gray-3 hover:bg-gray-4 focus:bg-gray-4 w-44 text-sm px-4 h-10 rounded-full focus:ring-1 focus:ring-cyan-1 transition duration-300 ease-in-out caret-cyan-1"
                required
              />
              <button
                className="box-border outline-none self-center relative w-32 inline-flex items-center justify-center rounded-full text-center font-semibold transition duration-300 ease-in-out bg-gray-12 text-gray-1 text-sm h-10 px-4 hover:bg-cyan-1 focus:bg-cyan-1"
                disabled={isSaving}
              >
                <Lottie
                  lottieRef={mailIconRef}
                  className="mr-1 w-5 h-5"
                  animationData={mailIcon}
                  loop={false}
                  autoplay={false}
                />
                <span className="relative top-px">{submitLabel}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
