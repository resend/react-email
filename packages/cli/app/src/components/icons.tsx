import classnames from 'classnames';
import * as React from 'react';

export type IconElement = React.ElementRef<'svg'>;
export type RootProps = React.ComponentPropsWithoutRef<'svg'>;

export interface IconProps extends RootProps {
  size?: number;
}

export const IconBase = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ size = 20, ...props }, forwardedRef) => (
    <svg
      ref={forwardedRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    />
  )
);

IconBase.displayName = 'IconBase';

export interface IconButtonProps extends React.ComponentPropsWithoutRef<'button'> {}

export const IconButton = React.forwardRef<HTMLButtonElement, Readonly<IconButtonProps>>(
  ({ children, className, ...props }, forwardedRef) => (
    <button
      {...props}
      ref={forwardedRef}
      className={classnames(
        'rounded focus:text-dark-bg-text ease-in-out transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-8 hover:text-dark-bg-text',
        className
      )}
    >
      {children}
    </button>
  )
);

IconButton.displayName = 'IconButton';

export const IconCheck = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M16.25 8.75L10.406 15.25L7.75 12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  )
);

IconCheck.displayName = 'IconCheck';

export const IconClipboard = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M9 6.75H7.75C6.64543 6.75 5.75 7.64543 5.75 8.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V8.75C18.25 7.64543 17.3546 6.75 16.25 6.75H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8.25H10C9.44772 8.25 9 7.80228 9 7.25V5.75C9 5.19772 9.44772 4.75 10 4.75H14C14.5523 4.75 15 5.19772 15 5.75V7.25C15 7.80228 14.5523 8.25 14 8.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 12.25H14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 15.25H14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  )
);

IconClipboard.displayName = 'IconClipboard';

export const IconDownload = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M4.75 14.75v1.5a3 3 0 0 0 3 3h8.5a3 3 0 0 0 3-3v-1.5M12 14.25v-9.5M8.75 10.75l3.25 3.5 3.25-3.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  )
);

IconDownload.displayName = 'IconDownload';
