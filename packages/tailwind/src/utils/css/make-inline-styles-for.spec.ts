import { useTailwind } from "../../hooks/use-tailwind";
import { makeInlineStylesFor } from "./make-inline-styles-for";

test("makeInlineStylesFor()", () => {
  const tailwind = useTailwind({});

  const className =
    "bg-red-500 sm:bg-blue-300 w-full md:max-w-[400px] my-custom-class";
  const tailwindStyles = tailwind.generateRootForClasses(className.split(" "));

  expect(makeInlineStylesFor(className, tailwindStyles)).toEqual({
    styles: { backgroundColor: "rgb(239 68 68 / 1)", width: "100%" },
    residualClassName: "sm:bg-blue-300 md:max-w-[400px] my-custom-class",
  });
});
