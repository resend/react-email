import * as React from "react";
import {
  conditionPropsDecider,
  NonMsoCloserPlaceholder,
  NonMsoOpenerPlaceholder,
} from "./shared/utils";
import type { MsoVersion } from "./shared/mso";

export type NonMsoGhostProps = Required<React.PropsWithChildren> & {
  version?: MsoVersion | MsoVersion[];
  ghostWrapper: (children: React.ReactNode) => React.ReactElement;
};

export const NonMsoGhost: React.FC<NonMsoGhostProps> = ({
  children,
  version,
  ghostWrapper,
}) => {
  const conditionProps = conditionPropsDecider(version);

  return (
    <>
      <NonMsoOpenerPlaceholder {...conditionProps} />
      {ghostWrapper(
        <>
          <NonMsoCloserPlaceholder />
          {children}
          <NonMsoOpenerPlaceholder {...conditionProps} />
        </>,
      )}
      <NonMsoCloserPlaceholder />
    </>
  );
};

NonMsoGhost.displayName = "NonMsoGhost";
