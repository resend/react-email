import path from "node:path";
import { existsSync } from "node:fs";
import { render } from "@react-email/components";
import { parse, stringify } from "html-to-ast";
import type { Attr, IDoc as Doc } from "html-to-ast/dist/types";
import { getComponentElement } from "../src/app/components/get-components";
import { componentsStructure, getComponentPathFromSlug } from "./structure";
import { Layout } from "./_components/layout";

type MaybeDoc = ReturnType<typeof parse>[number];

const walkAst = <T extends MaybeDoc>(ast: T[], callback: (doc: T) => void) => {
  for (const doc of ast) {
    callback(doc);
    if (doc.children) {
      walkAst(doc.children as T[], callback);
    }
  }
};

const getStyleObjectFromString = (style: string): Record<string, string> => {
  const obj: Record<string, string> = {};
  for (const line of style.split(";")) {
    const prop = line.split(":")[0];
    const value = line.split(":").slice(1).join(":");

    obj[prop] = value;
  }
  return obj;
};

const sortKeys = (object: object) => {
  return Object.keys(object).sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  })
}

const sortStyle = (style: string): string => {
  const object = getStyleObjectFromString(style);
  const styleProperties = sortKeys(object);
  return styleProperties.map((prop) => `${prop}:${object[prop]}`).join(";");
};

const getComparableHtml = (html: string): string => {
  const ast = parse(html);
  walkAst(ast, (doc) => {
    const orderedAttributes: Attr = {};
    if (doc.attrs) {
      for (const key of sortKeys(doc.attrs)) {
        orderedAttributes[key] = doc.attrs[key];
      }
      doc.attrs = orderedAttributes;
      if ("style" in doc.attrs) {
        const style = doc.attrs.style as string;
        doc.attrs.style = sortStyle(style);
      }
    }
  });
  return stringify(ast as Doc[]);
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
        const tailwindHtml = getComparableHtml(
          await render(<Layout>{tailwindElement}</Layout>, { pretty: true }),
        );
        const inlineStylesHtml = getComparableHtml(
          await render(
            <Layout withTailwind={false}>{inlineStylesElement}</Layout>,
            { pretty: true },
          ),
        );
        expect(tailwindHtml).toEqual(inlineStylesHtml);
      }
    });
  }
});
