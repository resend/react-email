import * as React from 'react';

type AvatarElement = React.ElementRef<'span'>;
type RootProps = React.ComponentPropsWithoutRef<'span'>;

//
// Avatar Component
//

export const Avatar = React.forwardRef<AvatarElement, Readonly<RootProps>>(
  ({ style, ...props }, forwardedRef) => (
    <span
      style={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%',
        overflow: 'hidden',
        width: '60px',
        height: '60px',
        backgroundColor: '#eaeaea',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12)',
        ...style,
      }}
      ref={forwardedRef}
      {...props}
    />
  ),
);

Avatar.displayName = 'Avatar';

//
// Avatar Image Component
//

export interface AvatarImageProps extends RootProps {
  src: string;
}

export const AvatarImage = React.forwardRef<
  AvatarElement,
  Readonly<AvatarImageProps>
>(({ src, style, ...props }, forwardedRef) => (
  <span
    style={{
      width: '60px',
      height: '60px',
      backgroundSize: '100%',
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      borderRadius: '100%',
      position: 'absolute',
      ...style,
    }}
    ref={forwardedRef}
    {...props}
  />
));

AvatarImage.displayName = 'AvatarImage';

//
// Avatar Fallback
//

export const AvatarFallback = React.forwardRef<
  AvatarElement,
  Readonly<RootProps>
>(({ children, style, ...props }, forwardedRef) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '60px',
      height: '60px',
      fontSize: '24px',
      ...style,
    }}
    ref={forwardedRef}
    {...props}
  >
    {abbreviate(children)}
  </span>
));

AvatarFallback.displayName = 'AvatarFallback';

const abbreviate = (fallback: any): string => {
  const text = fallback.toString();
  if (!text) {
    return '';
  }
  const textWords = text.split(' ');
  const initials = `${textWords[0][0]}${textWords[textWords.length - 1][0]}`;
  return initials;
};
