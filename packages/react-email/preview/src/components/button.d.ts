import * as React from 'react';
declare type RootProps = React.ComponentPropsWithoutRef<'button'>;
declare type Appearance = 'white' | 'gradient';
declare type Size = '1' | '2' | '3' | '4';
interface ButtonProps extends RootProps {
  asChild?: boolean;
  appearance?: Appearance;
  size?: Size;
}
export declare const Button: React.ForwardRefExoticComponent<
  Readonly<ButtonProps> & React.RefAttributes<HTMLButtonElement>
>;
export {};
//# sourceMappingURL=button.d.ts.map
