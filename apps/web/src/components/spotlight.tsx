"use client";

import classNames from "classnames";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
}

export const Spotlight = ({ children, className }: SpotlightProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const background = useMotionTemplate`
    radial-gradient(
      40rem circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, .06),
      transparent 80%
    )
  `;

  return (
    <div
      className={classNames("overflow-hidden", className)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />
    </div>
  );
};
