import classNames from "classnames";
import * as React from "react";

type IconButtonProps = React.ComponentPropsWithoutRef;

export const IconButton: React.FC = ({ children, className, ...props }) => (
  <button
    {...props}
    className={classNames(
      "rounded text-slate-11 transition duration-200 ease-in-out hover:text-slate-12 focus:text-slate-12 focus:outline-none focus:ring-2 focus:ring-slate-8",
      className,
    )}
    type="button"
  >
    {children}
  </button>
);
