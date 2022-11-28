import * as React from 'react';
declare type RootProps = React.ComponentPropsWithoutRef<'div'>;
interface LayoutProps extends RootProps {
  navItems: string[];
  viewMode?: string;
  setViewMode?: (viewMode: string) => void;
}
export declare const Layout: React.ForwardRefExoticComponent<
  Readonly<LayoutProps> & React.RefAttributes<HTMLDivElement>
>;
export {};
//# sourceMappingURL=layout.d.ts.map
