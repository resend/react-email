import classNames from 'classnames';
import * as React from 'react';
import type { As } from '../utils/as';
import { unreachable } from '../utils/unreachable';

type HeadingSize = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
type HeadingColor = 'white' | 'gray';
type HeadingWeight = 'medium' | 'bold';

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
      color = 'white',
      children,
      weight = 'bold',
      ...props
    },
    ref,
  ) => (
    <Tag
      className={classNames(
        className,
        getSizesClassNames(size),
        getColorClassNames(color),
        getWeightClassNames(weight),
      )}
      {...props}
      ref={ref}
    >
      {children}
    </Tag>
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
      return 'text-xl tracking-[-0.16px]';
    case '6':
      return 'text-2xl tracking-[-0.288px]';
    case '7':
      return 'text-[28px] leading-[34px] tracking-[-0.416px]';
    case '8':
      return 'text-[35px] leading-[42px] tracking-[-0.64px]';
    case '9':
      return 'text-6xl leading-[73px] tracking-[-0.896px]';
    case '10':
      return [
        'text-[38px] leading-[46px]',
        'md:text-[70px] md:leading-[85px] tracking-[-1.024px;]',
      ];
    default:
      return unreachable(size);
  }
};

const getColorClassNames = (color: HeadingColor) => {
  switch (color) {
    case 'gray':
      return 'text-slate-11';
    case 'white':
      return 'text-slate-12';
    default:
      return unreachable(color);
  }
};

const getWeightClassNames = (weight: HeadingWeight) => {
  switch (weight) {
    case 'medium':
      return 'font-medium';
    case 'bold':
      return 'font-bold';
    default:
      return unreachable(weight);
  }
};

Heading.displayName = 'Heading';
