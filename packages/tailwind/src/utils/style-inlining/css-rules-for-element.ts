import type { JitContext } from "tailwindcss/lib/lib/setupContextUtils";
import type { Root } from "postcss";
import {
  generatePostcssRootForClasses
} from "../tailwind";

export const cssRulesForElement = (
  element: React.ReactElement<{ className: string }>,
  context: JitContext
): Root => {
  const classes = element.props.className.split(" ");

  return generatePostcssRootForClasses(classes, context);
};
