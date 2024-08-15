"use client";

import * as React from "react";
import classNames from "classnames";
import { CodePreview } from "./code-preview";
import { CodeRenderer } from "./code-renderer";
import { ComponentPreview } from "./component-preview";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { Component } from "../app/components/get-components";

interface ComponentViewWrapperProps {
  components: Component[];
}

export const ComponentViewWrapper: React.FC<ComponentViewWrapperProps> = ({
  components,
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState("Tailwind");

  return (
    <div className="relative flex flex-col gap-4 border-y border-zinc-900 pt-4">
      {components.map((component, index) => (
        <React.Fragment key={index}>
          <h2
            className={classNames(
              "px-8 text-xl font-semibold text-zinc-200",
              index !== 0 && "border-t border-zinc-900 pt-4",
            )}
          >
            {component.title}
          </h2>
          <Tabs.Root
            className="relative flex flex-col gap-2 px-8 pb-1 pt-4"
            defaultValue="preview"
          >
            <div className="absolute right-0 top-0 h-px w-[100dvw] bg-zinc-900" />
            <div className="flex w-full items-center gap-4 px-8 py-1">
              <Tabs.List className="flex w-fit items-center gap-4">
                <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
                <Tabs.Trigger value="code">Code</Tabs.Trigger>
                <div className="ml-2 hidden h-5 w-px bg-zinc-900 sm:block" />
                <Select.Root
                  value={selectedVariant}
                  onValueChange={setSelectedVariant}
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Viewport>
                      {Object.keys(component.codePerVariant).map((variant) => (
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
            </div>
            <Tabs.Content
              className="relative mx-8 my-4 h-fit rounded-md border border-zinc-900"
              value="preview"
            >
              <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),_radial-gradient(#27272A_.0313rem,transparent_.0313rem)] opacity-80 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
              <ComponentPreview component={<component.component />} />
            </Tabs.Content>
            <Tabs.Content
              className="relative mx-8 my-4 rounded-md border border-zinc-900"
              value="code"
            >
              <CodePreview
                code={component.codePerVariant[selectedVariant] || ""}
              >
                <CodeRenderer
                  code={component.codePerVariant[selectedVariant] || ""}
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
