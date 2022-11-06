import * as SlotPrimitive from '@radix-ui/react-slot';
import classnames from 'classnames';
import * as React from 'react';
import { As, unreachable } from 'utils';

export type TextSize = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type TextColor = 'gray' | 'red';
export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize';
export type TextWeight = 'normal' | 'semibold';

interface TextOwnProps {
  size?: TextSize;
  color?: TextColor;
  transform?: TextTransform;
  weight?: TextWeight;
}

type TextProps = As<'span', 'div', 'p'> & TextOwnProps;

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      as: Tag = 'span',
      size = '3',
      color,
      transform,
      weight = 'normal',
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => (
    <SlotPrimitive.Slot
      ref={forwardedRef}
      className={classnames(
        className,
        transform,
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

const getSizesClassNames = (size: TextSize | undefined) => {
  switch (size) {
    case '1':
      return 'text-xs';
    case '2':
      return 'text-sm';
    case '3':
      return 'text-base';
    case '4':
      return 'text-lg leading-[26px]';
    case '5':
      return 'text-xl leading-[28px] tracking-[-0.01em]';
    case '6':
      return 'text-2xl leading-[30px] tracking-[-0.018em]';
    case '7':
      return 'text-[28px] leading-[36px] tracking-[-0.026em]';
    case '8':
      return 'text-[35px] leading-[40px] tracking-[-0.04em]';
    case '9':
      return 'text-6xl leading-[1] tracking-[-0.056em]';
    case undefined:
      return '';
    default:
      return unreachable(size);
  }
};

const getColorClassNames = (color: TextColor | undefined) => {
  switch (color) {
    case 'gray':
      return 'text-[#B4BCD0]';
    case 'red':
      return 'text-red-9';
    case undefined:
      return '';
    default:
      return unreachable(color);
  }
};

const getWeightClassNames = (weight: TextWeight | undefined) => {
  switch (weight) {
    case 'normal':
      return 'font-normal';
    case 'semibold':
      return 'font-semibold';
    case undefined:
      return '';
    default:
      return unreachable(weight);
  }
};

Text.displayName = 'Text';
