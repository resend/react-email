import classNames from "classnames";
import Link from "next/link";
import * as React from "react";
import { Logo } from "./logo";
import { Menu } from "./menu";

export const Topbar: React.FC<
  Readonly<React.ComponentPropsWithoutRef<"header">>
> = ({ className, ...props }) => (
  <header
    className={classNames(
      "flex h-[5rem] items-center justify-between px-4 md:h-[6.25rem]",
      className,
    )}
    {...props}
  >
    <Link href="/">
      <Logo />
    </Link>
    <Menu />
  </header>
);
