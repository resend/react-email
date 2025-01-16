import classNames from 'classnames';
import * as React from 'react';
import type { As } from '../utils/as';
import { unreachable } from '../utils/unreachable';

type TextSize = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type TextColor = 'gray' | 'white';

interface TextOwnProps {
  size?: TextSize;
  color?: TextColor;
}

type TextProps = As<'span', 'div', 'p'> & TextOwnProps;

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      as: Tag = 'span',
      size = '2',
      color = 'gray',
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <Tag
      className={classNames(
        className,
        getSizesClassNames(size),
        getColorClassNames(color),
      )}
      {...props}
      ref={ref}
    >
      {children}
    </Tag>
  ),
);

Text.displayName = 'Text';

const getSizesClassNames = (size: TextSize) => {
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
      return ['text-17px', 'md:text-xl tracking-[-0.16px]'];
    case '6':
      return 'text-2xl tracking-[-0.288px]';
    case '7':
      return 'text-[28px] leading-[34px] tracking-[-0.416px]';
    case '8':
      return 'text-[35px] leading-[42px] tracking-[-0.64px]';
    case '9':
      return 'text-6xl leading-[73px] tracking-[-0.896px]';
    default:
      return unreachable(size);
  }
};

const getColorClassNames = (color: TextColor) => {
  switch (color) {
    case 'white':
      return 'text-slate-12';
    case 'gray':
      return 'text-slate-11';
    default:
      return unreachable(color);
  }
};
