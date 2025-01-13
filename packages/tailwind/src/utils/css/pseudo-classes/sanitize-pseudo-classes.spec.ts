import postcss, { Root } from "postcss";
import { sanitizePseudoClasses } from "./sanitize-pseudo-classes";

test("sanitizePseudoClasses()", async () => {
  const { root } = await postcss()
    .process(
      `
.hover\\:text-sky-600:hover{
  --tw-text-opacity: 1;
  color: rgb(2 132 199 / var(--tw-text-opacity))
}

.focus\\:outline-none:focus{
  outline: 2px solid transparent;
  outline-offset: 2px
}

.hover\\:bg-gray-100:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity))
}

.regular-class{
  color: black
}
`,
    )
    .async();

  const { pseudoClassClasses, sanitizedPseudoClassRules } =
    sanitizePseudoClasses(root as Root);

  expect(pseudoClassClasses).toEqual([
    "hover:text-sky-600",
    "focus:outline-none",
    "hover:bg-gray-100",
  ]);

  expect(new Root({ nodes: sanitizedPseudoClassRules }).toString()).toBe(`
.hover_text-sky-600:hover{
  --tw-text-opacity: 1 !important;
  color: rgb(2 132 199 / var(--tw-text-opacity)) !important
}

.focus_outline-none:focus{
  outline: 2px solid transparent !important;
  outline-offset: 2px !important
}

.hover_bg-gray-100:hover{
  --tw-bg-opacity: 1 !important;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity)) !important
}`);
});
