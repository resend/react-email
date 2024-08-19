"use client";

import * as React from "react";
import classNames from "classnames";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { ImportedComponent } from "../app/components/get-components";
import { CodePreview } from "./code-preview";
import { CodeRenderer } from "./code-renderer";
import { ComponentPreview } from "./component-preview";

interface ComponentViewWrapperProps {
  components: RenderedComponent[];
}

export type RenderedComponent = Omit<ImportedComponent, "element"> & {
  html: string;
  code: string | Record<string, string>;
};

export const ComponentViewWrapper: React.FC<ComponentViewWrapperProps> = ({
  components,
}) => {
  const [selectedVariants, setSelectedVariants] = React.useState<string[]>(
    components.map(() => "tailwind"),
  );

  const handleVariantChange = (index: number, variant: string) => {
    const newSelectedVariants = [...selectedVariants];
    newSelectedVariants[index] = variant;
    setSelectedVariants(newSelectedVariants);
  };

  return (
    <div className="relative flex flex-col gap-4 border-y border-zinc-900 pt-3">
      {components.map((component, index) => (
        <React.Fragment key={index}>
          <Tabs.Root
            className="relative flex flex-col gap-2"
            defaultValue="preview"
          >
            <div
              className={classNames(
                "relative flex w-full items-center gap-4 px-8 pb-2",
                index !== 0 && "border-t border-zinc-900 pt-4",
              )}
            >
              <h2 className="shrink grow basis-0 text-xl font-semibold text-zinc-200">
                {component.title}
              </h2>
              <Tabs.List className="flex w-fit items-center gap-4 text-xs">
                <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
                <Tabs.Trigger value="code">Code</Tabs.Trigger>
                <div className="ml-2 hidden h-5 w-px bg-zinc-900 sm:block" />
                <Select.Root
                  onValueChange={(variant) => {
                    handleVariantChange(index, variant);
                  }}
                  value={selectedVariants[index]}
                >
                  <Select.Trigger
                    aria-label="Choose the styling solution"
                    className="inline-flex h-8 items-center justify-center gap-1 rounded bg-zinc-900 px-3 leading-none outline-none data-[placeholder]:text-zinc-50"
                  >
                    <Select.Value>
                      {selectedVariants[index] === "tailwind"
                        ? "Tailwind CSS"
                        : "Inline Styles"}
                    </Select.Value>
                    <Select.Icon>
                      <ChevronDownIcon size={14} />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden rounded-md bg-zinc-900">
                      <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center">
                        <ChevronUpIcon size={12} />
                      </Select.ScrollUpButton>
                      <Select.Viewport className="p-1">
                        <Select.Group className="flex flex-col">
                          <Select.Label className="px-2 pb-1 pt-2 text-xs text-zinc-200">
                            Styling solution
                          </Select.Label>
                          {typeof component.code === "object" &&
                            Object.keys(component.code).map((variant) => (
                              <Select.Item
                                className="relative mt-1 flex h-6 cursor-pointer select-none items-center rounded-[.25rem] px-6 py-2 text-xs leading-none text-zinc-400 transition-colors ease-[cubic-bezier(.36,.66,.6,1)] data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-800 data-[highlighted]:text-zinc-50 data-[highlighted]:outline-none"
                                key={variant}
                                value={variant}
                              >
                                <Select.ItemText>
                                  {variant === "tailwind"
                                    ? "Tailwind CSS"
                                    : "Inline Styles"}
                                </Select.ItemText>
                                <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center text-zinc-200">
                                  <CheckIcon size={10} />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                        </Select.Group>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                <button tabIndex={0} type="button">
                  <span>Copy</span>
                </button>
              </Tabs.List>
              <div className="absolute bottom-0 right-0 h-px w-[100dvw] bg-zinc-900" />
            </div>
            <Tabs.Content
              className="relative mx-8 my-4 h-max rounded-md border border-zinc-900 bg-slate-100"
              value="preview"
            >
              <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#091A21_.0313rem,transparent_.0313rem),_radial-gradient(#091A21_.0313rem,transparent_.0313rem)] opacity-30 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
              <ComponentPreview html={component.html} />
            </Tabs.Content>
            <Tabs.Content
              className="relative mx-8 my-4 rounded-md border border-zinc-900"
              value="code"
            >
              {typeof component.code === "string" ? (
                <CodePreview code={component.code}>
                  <CodeRenderer code={component.code} lang="tsx" />
                </CodePreview>
              ) : (
                <CodePreview
                  code={component.code[selectedVariants[index]] || ""}
                >
                  <CodeRenderer
                    code={component.code[selectedVariants[index]] || ""}
                    lang="tsx"
                  />
                </CodePreview>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </React.Fragment>
      ))}
    </div>
  );
};
