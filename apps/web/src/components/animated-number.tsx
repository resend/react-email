'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  from?: number;
  to?: number;
  delay?: number;
  className?: string;
}

export const AnimatedNumber = ({
  from = 0,
  to = 100,
  delay = 1,
  className = '',
}: AnimatedNumberProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const spring = useSpring(from, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        spring.set(to);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, spring, to, delay]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
};
