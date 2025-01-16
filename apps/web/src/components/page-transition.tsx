'use client';

import classNames from 'classnames';
import type { HTMLMotionProps, SVGMotionProps } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';

type MotionComponentType = keyof typeof motion;

interface PageTransitionProps {
  tag?: MotionComponentType;
  children: React.ReactNode;
  className?: string;
  key: string;
}

const PageTransition = ({
  tag = 'div',
  children,
  className = '',
  key,
}: PageTransitionProps) => {
  const MotionComponent = motion[
    tag as MotionComponentType
  ] as React.ComponentType<HTMLMotionProps<'div'> | SVGMotionProps<'svg'>>;

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={classNames('relative z-[2] w-full', className)}
        initial={{
          opacity: 0,
          y: 4,
        }}
        key={key}
        transition={{ duration: 0.3, ease: [0.36, 0.66, 0.6, 1] }}
      >
        {children}
      </MotionComponent>
    </AnimatePresence>
  );
};

export default PageTransition;
