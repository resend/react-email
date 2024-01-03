import type { Root } from "postcss";
import { useRgbNonSpacedSyntax } from "../css";

export const sanitizePostcssRootForEmailStyles = (root: Root) => {
  const newRoot = root.clone();

  newRoot.walkDecls(decl => {
    decl.value = useRgbNonSpacedSyntax(decl.value);
    if (decl.parent?.parent?.type === 'atrule') {
      decl.value = `${decl.value}!important`;
    }
  });

  return newRoot;
};
