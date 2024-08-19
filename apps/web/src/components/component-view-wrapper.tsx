"use client";

import * as React from "react";
import classNames from "classnames";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import type { ImportedComponent } from "../app/components/get-components";
import { CodePreview } from "./code-preview";
import { CodeRenderer } from "./code-renderer";
import { ComponentPreview } from "./component-preview";

export type RenderedComponent = Omit<ImportedComponent, "element"> & {
  html: string;
};

interface ComponentViewWrapperProps {
  components: RenderedComponent[];
}

export const ComponentViewWrapper: React.FC<ComponentViewWrapperProps> = ({
  components,
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState("Tailwind");

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
              <Tabs.List className="flex w-fit items-center gap-4">
                <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
                <Tabs.Trigger value="code">Code</Tabs.Trigger>
                <div className="ml-2 hidden h-5 w-px bg-zinc-900 sm:block" />
                <Select.Root
                  onValueChange={setSelectedVariant}
                  value={selectedVariant}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Viewport>
                      {/* TODO: treat the case where `code` here is just a string. Read its type description for more info. */}
                      {Object.keys(component.code).map((variant) => (
                        <Select.Item key={variant} value={variant}>
                          <Select.ItemText>
                            {variant === "Tailwind"
                              ? "Tailwind CSS"
                              : "Inline Styles"}
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Root>
                <button tabIndex={0} type="button">
                  <span>Copy</span>
                </button>
              </Tabs.List>
              <div className="absolute bottom-0 right-0 h-px w-[100dvw] bg-zinc-900" />
            </div>
            <Tabs.Content
              className="relative mx-8 my-4 h-fit rounded-md border border-zinc-900"
              value="preview"
            >
              <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),_radial-gradient(#27272A_.0313rem,transparent_.0313rem)] opacity-80 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
              <ComponentPreview html={component.html} />
            </Tabs.Content>
            <Tabs.Content
              className="relative mx-8 my-4 rounded-md border border-zinc-900"
              value="code"
            >
              {/* TODO: treat the case where `code` here is just a string. Read its type description for more info. */}
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <CodePreview code={component.code[selectedVariant] || ""}>
                <CodeRenderer
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  code={component.code[selectedVariant] || ""}
                  lang="tsx"
                />
              </CodePreview>
            </Tabs.Content>
          </Tabs.Root>
        </React.Fragment>
      ))}
    </div>
  );
};
