import fs from "node:fs";
import path from "node:path";
import Module from "node:module";
import { stringify } from "json5";
import { parse } from "@typescript-eslint/parser";
import { SourceCode } from "@typescript-eslint/utils/ts-eslint";
import { getTailwindConfigFromSourceCode } from "./get-tailwind-config-from-source-code";

function mockRequire(mockedUri: string, stub: unknown) {
  // @ts-expect-error This function isn't defined on @types/node but it is there
  const originalLoad = Module._load as (uri: string, parent: unknown) => unknown;
  // @ts-expect-error This function isn't defined on @types/node but it is there
  Module._load = (uri: string, parent: unknown) => {
    if (uri === mockedUri) return stub;
    return originalLoad(uri, parent);
  };
}

const getSourceCodeFor = (text: string) => {
  const ast = parse(text, {
    tokens: true,
    comment: true,
    loc: true,
    range: true,
    ecmaFeatures: {
      jsx: true,
    },
    defaultFilenames: { ts: "file.ts", tsx: "react.tsx" },
  });
  return new SourceCode(text, ast as SourceCode.Program);
};

const tailwindConfig = {
  theme: {
    colors: {
      "red-1000": "#fff",
    },
  },
};

describe("getTailwindConfigFromSourceCode()", () => {
  it("should work with a tailwind.config file", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => {
      return p.toString().endsWith(".ts");
    });

    console.log(module.require);
    mockRequire(path.resolve(process.cwd(), "tailwind.config.ts"), {
      default: tailwindConfig,
    });

    const sourceCode =
      getSourceCodeFor(`import tailwindConfig from 'tailwind.config';

function Component() {
  return <Tailwind 
    config={tailwindConfig} 
  />;
}`);
    expect(getTailwindConfigFromSourceCode(sourceCode)).toEqual(tailwindConfig);

    vi.clearAllMocks();
  });

  it("should work without a tailwind.config file", () => {
    const sourceCode = getSourceCodeFor(`function Component() {
  return <Tailwind 
    config={${stringify(tailwindConfig)}} 
  />;
}`);
    expect(getTailwindConfigFromSourceCode(sourceCode)).toEqual(tailwindConfig);
  });
});
