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
  const styles = { maxWidth: '37.5em', ...style };
  const inlineStyle = styleToString(styles);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<!--[if mso | IE]>
            <table role="presentation" width="100%" align="center" style="${inlineStyle}"><tr><Column></Column><Column style="width:37.5em;background:#ffffff">
          <![endif]-->`,
        }}
      />
      <div ref={forwardedRef} style={styles} {...props}>
        {children}
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: `<!--[if mso | IE]>
          </Column><Column></Column></tr></table>
          <![endif]-->`,
        }}
      />
    </>
  );
});

Container.displayName = 'Container';
