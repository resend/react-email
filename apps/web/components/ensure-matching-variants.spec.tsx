import path from "node:path";
import { existsSync } from "node:fs";
import { render } from "@react-email/components";
import { parse } from "html-to-ast";
import { getComponentElement } from "../src/app/components/get-components";
import { componentsStructure, getComponentPathFromSlug } from "./structure";
import { Layout } from "./_components/layout";

type Doc = Omit<ReturnType<typeof parse>[number], "style">;
type DocWithSetStyle = Omit<Doc, "children"> & {
  style?: Record<string, string>;
  children?: DocWithSetStyle[];
};

const walkAst = <T extends Doc>(ast: T[], callback: (doc: T) => void) => {
  for (const doc of ast) {
    callback(doc);
    if (doc.children) {
      walkAst(doc.children as T[], callback);
    }
  }
};

const getComparableAstFrom = (html: string): DocWithSetStyle[] => {
  const ast = parse(html) as Doc[];
  walkAst(ast, (doc) => {
    if (doc.attrs && "style" in doc.attrs) {
      const style = doc.attrs.style as string;
      (doc as DocWithSetStyle).style = {};
      for (const line of style.split(";")) {
        const prop = line.split(":")[0];
        const value = line.split(":").slice(1).join(":");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (doc as DocWithSetStyle).style![prop] = value;
      }
      delete doc.attrs.style;
    }
  });
  return ast as DocWithSetStyle[];
};

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
        const tailwindAst = getComparableAstFrom(
          await render(<Layout>{tailwindElement}</Layout>),
        );
        const inlineStylesAst = getComparableAstFrom(
          await render(
            <Layout withTailwind={false}>{inlineStylesElement}</Layout>,
          ),
        );
        expect(tailwindAst).toEqual(inlineStylesAst);
      }
    });
  }
});
