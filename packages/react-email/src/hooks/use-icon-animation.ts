import type { LottieRefCurrentProps } from 'lottie-react';
import * as React from 'react';

const TIMEOUT = 150;
const THRESHOLD_ANIMATION = 0.9;

export const useIconAnimation = () => {
  const ref = React.useRef<LottieRefCurrentProps>(null);
  const timer = React.useRef<NodeJS.Timeout | null>(null);

  const onMouseLeave = React.useCallback(() => {
    timer.current && clearTimeout(timer.current);
  }, []);

  const onMouseEnter = React.useCallback(() => {
    if (!ref.current) {
      return;
    }

    const total = Math.round(ref.current.animationItem?.totalFrames ?? 0);
    const current = Math.round(
      (ref.current.animationItem?.currentFrame ?? 0) + 1,
    );

    if (current === 1 || current >= total * THRESHOLD_ANIMATION) {
      timer.current = setTimeout(() => {
        if (!ref.current) {
          return;
        }

        ref.current.stop();
        ref.current.setDirection(1);
        ref.current.setSpeed(1);
        ref.current.play();
      }, TIMEOUT);
    }
  }, []);

  return {
    ref,
    onMouseLeave,
    onMouseEnter,
  };
};
