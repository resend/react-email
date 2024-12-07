import * as React from "react";
import {
  childrenPropsDecider,
  conditionPropsDecider,
  MsoPlaceholder,
} from "./shared/utils";
import type { MsoConditionalVersion, MsoVersion } from "./shared/mso";

type Version = MsoVersion | MsoConditionalVersion;

export type MsoProps = Required<React.PropsWithChildren> & {
  version?: Version | Version[];
};

export const Mso: React.FC<MsoProps> = ({ children, version }) => (
  <MsoPlaceholder
    {...conditionPropsDecider(version)}
    {...childrenPropsDecider(children)}
  />
);

Mso.displayName = "Mso";
