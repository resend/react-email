import * as React from 'react';

/*
  Avatar Component
*/
type AvatarElement = React.ElementRef<'span'>;
type RootProps = React.ComponentPropsWithoutRef<'span'>;

export const Avatar = React.forwardRef<AvatarElement, Readonly<RootProps>>(
  ({ ...props }, forwardedRef) => <span ref={forwardedRef} {...props} />,
);

Avatar.displayName = 'Avatar';

/*
  Avatar Image Component
*/
type AvatarImageElement = React.ElementRef<'img'>;
type ImageProps = React.ComponentPropsWithoutRef<'img'>;

export interface AvatarImageProps extends ImageProps {
  src: string;
}

export const AvatarImage = React.forwardRef<
  AvatarImageElement,
  Readonly<AvatarImageProps>
>(({ alt, src, ...props }, forwardedRef) => (
  <img alt={alt} src={src} ref={forwardedRef} {...props} />
));

AvatarImage.displayName = 'AvatarImage';

/*
  Avatar Fallback
*/
type AvatarFallbackElement = React.ElementRef<'span'>;
type AvatarFallbackProps = React.ComponentPropsWithoutRef<'span'>;

export const AvatarFallback = React.forwardRef<
  AvatarFallbackElement,
  Readonly<AvatarFallbackProps>
>(({ children, ...props }, forwardedRef) => (
  <span ref={forwardedRef} {...props}>
    {children}
  </span>
));

AvatarFallback.displayName = 'AvatarFallback';
