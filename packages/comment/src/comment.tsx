import * as React from "react";
import { childrenPropsDecider, CommentPlaceholder } from "./shared/utils";

export type CommentProps = Required<React.PropsWithChildren>;

export const Comment: React.FC<CommentProps> = ({ children }) => (
  <CommentPlaceholder {...childrenPropsDecider(children)} />
);

Comment.displayName = "Comment";
