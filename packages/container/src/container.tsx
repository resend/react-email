import * as React from 'react';
import { styleToString } from 'utils';

type ContainerElement = React.ElementRef<'div'>;
type RootProps = React.ComponentPropsWithoutRef<'div'>;

export interface ContainerProps extends RootProps {
  style?: React.CSSProperties;
}

export const Container = React.forwardRef<
  ContainerElement,
  Readonly<ContainerProps>
>(({ children, style, ...props }, forwardedRef) => {
  const styles = styleToString({
    maxWidth: style?.maxWidth ? style?.maxWidth : '37.5em',
    width: '100%',
    margin: '0 auto',
    ...style,
  });

  return (
    <div
      ref={forwardedRef}
      dangerouslySetInnerHTML={{
        __html: `<!--[if true]><table role="presentation" style="${styles}" align="center"><tr><td><![endif]--><div style="${styles}">${children}</div><!--[if true]></td></tr></table><![endif]-->`,
      }}
      {...props}
    />
  );
});

Container.displayName = 'Container';
