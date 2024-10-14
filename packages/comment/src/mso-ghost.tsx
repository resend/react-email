import * as React from "react";
import {
  conditionPropsDecider,
  MsoPlaceholderCloser,
  MsoPlaceholderOpener,
} from "./shared/utils";
import type { MsoConditionalVersion, MsoVersion } from "./shared/mso";

type Version = MsoVersion | MsoConditionalVersion;

export type MsoGhostProps = Required<React.PropsWithChildren> & {
  version?: Version | Version[];
  ghostWrapper: (children: React.ReactNode) => React.ReactElement;
};

export const MsoGhost: React.FC<MsoGhostProps> = ({
  children,
  version,
  ghostWrapper,
}) => {
  const conditionProps = conditionPropsDecider(version);

  return (
    <>
      <MsoPlaceholderOpener {...conditionProps} />
      {ghostWrapper(
        <>
          <MsoPlaceholderCloser />
          {children}
          <MsoPlaceholderOpener {...conditionProps} />
        </>,
      )}
      <MsoPlaceholderCloser />
    </>
  );
};

MsoGhost.displayName = "MsoGhost";
