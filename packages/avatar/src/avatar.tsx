import * as React from 'react';
import { Img } from '@react-email/img';

type AvatarElement = React.ElementRef<'tr'>;
type RootProps = React.ComponentPropsWithoutRef<'tr'>;

export interface AvatarProps extends RootProps {
  from: string;
  fromAlt?: string;
  to?: string;
  toAlt?: string;
}

const userAvatar = {
  borderRadius: '50%',
  overflow: 'hidden',
  border: '1px solid #eaeaea',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12)',
};

export const Avatar = React.forwardRef<AvatarElement, Readonly<AvatarProps>>(
  ({ from, fromAlt, to, toAlt, style, ...props }, forwardedRef) => {
    const render = {
      fromTo: (
        <tr>
          <td align="left" valign="middle">
            <Img
              src={from}
              alt={fromAlt}
              style={userAvatar}
              width="60"
              height="60"
            />
          </td>
          <td align="left" valign="middle">
            <Img
              src="https://assets.vercel.com/email/team-invite-arrow.png"
              width="12"
              height="9"
              alt="invited you to"
            />
          </td>
          <td align="left" valign="middle">
            <Img
              src={to}
              alt={toAlt}
              style={userAvatar}
              width="60"
              height="60"
            />
          </td>
        </tr>
      ),
      from: (
        <tr>
          <td align="left" valign="middle">
            <Img
              src={from}
              alt={fromAlt}
              style={userAvatar}
              width="60"
              height="60"
            />
          </td>
        </tr>
      ),
    };
    return <div>{to ? render.fromTo : render.from}</div>;
  },
);

Avatar.displayName = 'Avatar';
