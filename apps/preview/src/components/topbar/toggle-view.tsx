import * as React from 'react';
import codeIcon from '../../helpers/code.json';
import eyeIcon from '../../helpers/eye.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface ToggleViewProps {
  isPreview?: boolean;
  setIsPreview: (status: boolean) => void;
}

export default function ToggleView({
  isPreview,
  setIsPreview,
}: ToggleViewProps) {
  const codeIconRef = React.useRef<LottieRefCurrentProps>(null);
  const eyeIconRef = React.useRef<LottieRefCurrentProps>(null);

  return (
    <div className="flex items-center justify-center">
      <button
        className={`text-current transition duration-300 ease-in-out px-2 border border-gray-8 rounded-l-lg ${
          isPreview ? 'bg-gray-8' : 'bg-transparent'
        }`}
        onClick={() => {
          setIsPreview(true);
        }}
        onMouseEnter={() => {
          eyeIconRef.current?.play();
        }}
        onMouseLeave={() => {
          eyeIconRef.current?.stop();
        }}
      >
        <Lottie
          lottieRef={eyeIconRef}
          className="w-5 h-8"
          animationData={eyeIcon}
          loop={false}
          autoplay={false}
        />
      </button>
      <button
        className={`text-current transition duration-300 ease-in-out px-2 border border-gray-8 rounded-r-lg  ${
          !isPreview ? 'bg-gray-8' : 'bg-transparent'
        }`}
        onClick={() => {
          setIsPreview(false);
        }}
        onMouseEnter={() => {
          codeIconRef.current?.play();
        }}
        onMouseLeave={() => {
          codeIconRef.current?.stop();
        }}
      >
        <Lottie
          lottieRef={codeIconRef}
          className="w-5 h-8"
          animationData={codeIcon}
          loop={false}
          autoplay={false}
        />
      </button>
    </div>
  );
}
