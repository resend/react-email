import classnames from "classnames";
import Link from "next/link";
import * as React from "react";
import { Badge } from "./badge";
import { Logo } from "./logo";
import { Menu } from "./menu";

type TopbarElement = React.ElementRef<"header">;
type RootProps = React.ComponentPropsWithoutRef<"header">;

type TopbarProps = RootProps;

export const Topbar = React.forwardRef<TopbarElement, Readonly<TopbarProps>>(
  ({ className, ...props }, forwardedRef) => (
    <header
      className={classnames(
        "flex h-[80px] items-center justify-between md:h-[100px]",
        className,
      )}
      ref={forwardedRef}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Link href="/">
          <Logo />
        </Link>
        <Badge>Beta</Badge>
      </div>
      <Menu />
    </header>
  ),
);

Topbar.displayName = "Topbar";
