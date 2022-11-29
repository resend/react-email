import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { As } from 'utils';

interface HeadingOwnProps {}

type HeadingAs = As<'h1', 'h2', 'h3', 'h4', 'h5', 'h6'>;
type HeadingProps = HeadingAs & HeadingOwnProps;

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  Readonly<HeadingProps>
>(({ as: Tag = 'h1', children, style, ...props }, forwardedRef) => {
  const styles = { ...getDefaultStyles(Tag), ...style };
  return (
    <Slot ref={forwardedRef} style={styles} {...props}>
      <Tag>{children}</Tag>
    </Slot>
  );
});

const getDefaultStyles = (as: string) => {
  switch (as) {
    default:
    case 'h1':
      return { margin: '.67em 0', fontSize: '2em' };
    case 'h2':
      return { margin: '.83em 0', fontSize: '1.5em' };
    case 'h3':
      return { margin: '1em 0', fontSize: '1.17em' };
    case 'h4':
      return { margin: '1.33em 0', fontSize: '1em' };
    case 'h5':
      return { margin: '1.67em 0', fontSize: '.83em' };
    case 'h6':
      return { margin: '2.33em 0', fontSize: '.67em' };
  }
};

Heading.displayName = 'Heading';
