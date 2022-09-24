import * as React from 'react';
import launchIcon from '../../helpers/launch-icon.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

export default function External() {
  const launchIconRef = React.useRef<LottieRefCurrentProps>(null);

  return (
    <a
      href="/api/preview"
      target="_blank"
      className="text-current transition duration-300 ease-in-out hover:opacity-60"
      onMouseEnter={() => {
        launchIconRef.current?.play();
      }}
      onMouseLeave={() => {
        launchIconRef.current?.stop();
      }}
    >
      <Lottie
        lottieRef={launchIconRef}
        className="mr-1 w-5 h-5"
        animationData={launchIcon}
        loop={false}
        autoplay={false}
      />
    </a>
  );
}