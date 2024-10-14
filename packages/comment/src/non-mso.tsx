import * as React from "react";
import {
  conditionPropsDecider,
  NonMsoCloserPlaceholder,
  NonMsoOpenerPlaceholder,
} from "./shared/utils";
import type { MsoVersion } from "./shared/mso";

export type NonMsoProps = Required<React.PropsWithChildren> & {
  version?: MsoVersion | MsoVersion[];
};

export const NonMso: React.FC<NonMsoProps> = ({ children, version }) => (
  <>
    <NonMsoOpenerPlaceholder {...conditionPropsDecider(version)} />
    {children}
    <NonMsoCloserPlaceholder />
  </>
);

NonMso.displayName = "NonMso";
