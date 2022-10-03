import * as React from 'react';

type AvatarElement = React.ElementRef<'span'>;
type RootProps = React.ComponentPropsWithoutRef<'span'>;

export interface AvatarProps extends RootProps {
  src: string;
  name: string;
}

export const Avatar = React.forwardRef<AvatarElement, Readonly<AvatarProps>>(
  ({ src, name, ...props }, forwardedRef) => {
    avatarImg.backgroundImage = `url(${src})`;

    return (
      <>
        <span
          style={avatarContainer}
          ref={forwardedRef}
          {...props}
        >
          <label style={avatarLabel}>{abbreviete(name)}</label>
          <span style={avatarImg}></span>
        </span>
      </>
    );
  },
);

Avatar.displayName = 'Avatar';

const abbreviete = (text = ''): string => {
  const textWords = text.split(' ');
  const initials = `${textWords[0][0]}${textWords[textWords.length - 1][0]}`;
  return initials;
};

const avatarContainer = {
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '100%',
  overflow: 'hidden',
  backgroundColor: '#eaeaea',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12)',
  width: '60px',
  height: '60px',
};

const avatarImg = {
  width: '60px',
  height: '60px',
  backgroundSize: '100%',
  backgroundImage: '',
  backgroundRepeat: 'no-repeat',
  borderRadius: '100%',
  marginTop: '-100%',
};

const avatarLabel = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60px',
  height: '60px',
  fontSize: '24px',
};
