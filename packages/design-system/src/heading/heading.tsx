import * as SlotPrimitive from '@radix-ui/react-slot';
import classnames from 'classnames';
import * as React from 'react';
import { As, unreachable } from 'utils';

export type HeadingSize =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10';
export type HeadingColor = 'gray';
export type HeadingWeight = 'normal' | 'semibold';

interface HeadingOwnProps {
  size?: HeadingSize;
  color?: HeadingColor;
  weight?: HeadingWeight;
}

type HeadingProps = As<'h1', 'h2', 'h3', 'h4', 'h5', 'h6'> & HeadingOwnProps;

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Tag = 'h1',
      size = '3',
      className,
      color,
      children,
      weight = 'semibold',
      ...props
    },
    forwardedRef,
  ) => (
    <SlotPrimitive.Slot
      ref={forwardedRef}
      className={classnames(
        className,
        getSizesClassNames(size),
        getColorClassNames(color),
        getWeightClassNames(weight),
      )}
      {...props}
    >
      <Tag>{children}</Tag>
    </SlotPrimitive.Slot>
  ),
);

const getSizesClassNames = (size: HeadingSize) => {
  switch (size) {
    case '1':
      return 'text-xs';
    case '2':
      return 'text-sm';
    case '3':
      return 'text-base';
    case '4':
      return 'text-lg';
    case '5':
      return 'text-xl tracking-[-0.01em]';
    case '6':
      return 'text-2xl tracking-[-0.018em]';
    case '7':
      return 'text-3xl tracking-[-0.026em]';
    case '8':
      return 'text-4xl tracking-[-0.04em]';
    case '9':
      return 'text-5xl tracking-[-0.056em]';
    case '10':
      return 'text-6xl tracking-[-0.056em]';
  }
};

const getColorClassNames = (color: HeadingColor | undefined) => {
  switch (color) {
    case 'gray':
      return 'text-[#B4BCD0]';
    case undefined:
      return 'text-gray-12';
    default:
      return unreachable(color);
  }
};

const getWeightClassNames = (weight: HeadingWeight | undefined) => {
  switch (weight) {
    case 'normal':
      return 'font-normal';
    case 'semibold':
    case undefined:
      return 'font-semibold';
    default:
      return unreachable(weight);
  }
};

Heading.displayName = 'Heading';
