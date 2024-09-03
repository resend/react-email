import path from "node:path";
import { existsSync } from "node:fs";
import { render } from "@react-email/components";
import { getComponentElement } from "../src/app/components/get-components";
import { componentsStructure, getComponentPathFromSlug } from "./structure";
import { Layout } from "./_components/layout";

describe("copy-paste components", () => {
  const components = componentsStructure.flatMap(
    (category) => category.components,
  );
  for (const component of components) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    test(`${component.slug}'s variants should all match`, async () => {
      const componentPath = getComponentPathFromSlug(component.slug);
      const tailwindVariantPath = path.join(componentPath, "tailwind.tsx");
      const inlineStylesVariantPath = path.join(
        componentPath,
        "inline-styles.tsx",
      );
      if (
        existsSync(tailwindVariantPath) &&
        existsSync(inlineStylesVariantPath)
      ) {
        const tailwindElement = await getComponentElement(tailwindVariantPath);
        const inlineStylesElement = await getComponentElement(
          inlineStylesVariantPath,
        );
        const tailwindHtml = await render(<Layout>{tailwindElement}</Layout>);
        const inlineStylesHtml = await render(
          <Layout withTailwind={false}>{inlineStylesElement}</Layout>,
        );
        expect(
          tailwindHtml,
          `Expected Tailwind and Inline Styles to match the HTML on the component ${component.slug}`,
        ).toBe(inlineStylesHtml);
      }
    });
  }
});
