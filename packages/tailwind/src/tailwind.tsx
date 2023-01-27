import * as React from 'react';
import { tailwindToCSS, TailwindConfig } from 'tw-to-css';

export interface TailwindProps {
  children: React.ReactNode;
  config?: TailwindConfig;
}

export const Tailwind: React.FC<Readonly<TailwindProps>> = ({
  children,
  config,
}) => {
  const { twj } = tailwindToCSS({ config });

  const replaceTailwindStyles = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const { className, children: childChildren, style, ...rest } = child.props;

    return React.cloneElement(child, {
      ...rest,
      children: React.Children.map(childChildren, replaceTailwindStyles),
      style: { ...style, ...(className ? twj(className) : {}) },
    });
  };

  const tailwindStylesToCSS = React.Children.map(
    children,
    replaceTailwindStyles,
  );

  return <>{tailwindStylesToCSS}</>;
};

Tailwind.displayName = 'Tailwind';
